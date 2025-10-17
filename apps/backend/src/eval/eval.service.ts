import { BadRequestException, Injectable } from '@nestjs/common';
import { GeminiService } from '../gemini.service.js';
import { createPartFromUri, createUserContent, GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION } from './constants.js';
import { AUTH_PROVIDERS, GEMINI_RESPONSE_DELIMITER } from '@cover-letter-ai/constants';
import type { EvalService_Eval_Response } from '@cover-letter-ai/constants';
import { DbService } from 'src/db/db.service';
import { EvalClDto } from './eval-cl.dto.js';
import { UserDocument } from 'src/db/schema/user.schema.js';
import { ConfigService } from '@nestjs/config';
import { unlinkSync, writeFileSync } from 'fs';
import { GuestDocument } from 'src/db/schema/guest.schema.js';

@Injectable()
export class EvalService {
  private readonly ai: GoogleGenAI;

  constructor(
    private readonly gemini: GeminiService,
    private readonly db: DbService,
    readonly config: ConfigService,
  ) {
    this.ai = this.gemini.ai;
  }

  async eval(
    { jobDescription, additionalInfo, captchaToken }: EvalClDto,
    resume: Express.Multer.File,
    currentUser: UserDocument | GuestDocument,
  ) {
    if (!(await this.verifyCaptchaToken(captchaToken, currentUser.ipAddress))) throw new BadRequestException('Invalid captcha token');

    if (currentUser.exhaustedUses >= currentUser.useLimit) throw new BadRequestException('You have exhausted your use limit');

    let textualPrompt: string;
    if (!additionalInfo) textualPrompt = `Job Description: ${jobDescription}`;
    else textualPrompt = `Job Description: ${jobDescription}\nMy Relevant Information: ${additionalInfo}`;

    const contentParts: any = [textualPrompt];
    const resumeFileUri: string | null = null;
    if (resume) {
      const resumeFileLocalTempName = `${currentUser.id.substring(0, 5)}-${resume.originalname}.pdf`;
      writeFileSync(resumeFileLocalTempName, resume.buffer);
      const resumeFile = await this.ai.files.upload({
        file: new Blob([resume.buffer], { type: resume.mimetype }),
      });
      contentParts.push(createPartFromUri(resumeFile.uri || '', resume.mimetype));
      unlinkSync(resumeFileLocalTempName);
    }

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: createUserContent(contentParts),
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });

    if (!response.text) {
      throw new BadRequestException('Failed to generate response from Gemini');
    }

    const splitResponse = response.text?.split(GEMINI_RESPONSE_DELIMITER);
    let coverLetter = splitResponse?.[0]?.trim();
    if (coverLetter) {
      coverLetter = coverLetter.replace(/(\s*---)?\s*\**\s*$/, '').trim();
    }

    const suggestionsText = splitResponse?.[1]?.trim();
    const suggestions = suggestionsText
      ? suggestionsText
          .split('\n')
          .map((line) =>
            line
              .trim()
              .replace(/^[\*\-]\s*/, '')
              .trim(),
          )
          .filter(Boolean)
      : [];

    if (currentUser.provider !== AUTH_PROVIDERS.GUEST) {
      await this.db.user.updateOne({ id: currentUser.id }, { $inc: { exhaustedUses: 1 } });
    } else {
      await this.db.guest.updateOne({ id: currentUser.id }, { $inc: { exhaustedUses: 1 } });
    }

    await this.db.use.create({
      userId: currentUser.id,
      useCount: currentUser.exhaustedUses + 1,
      jobDescription,
      additionalInfo,
      documentUrl: resumeFileUri || '',
      documentType: resume.mimetype,
      documentName: resume.originalname,
      suggestions,
      coverLetter,
      type: currentUser.provider === AUTH_PROVIDERS.GUEST ? 'GUEST' : 'USER',
    });

    return { coverLetter, suggestions } as EvalService_Eval_Response;
  }

  private async verifyCaptchaToken(token: string, ip: string | null | undefined): Promise<boolean> {
    const formData = new FormData();
    formData.append('secret', this.config.get('TURNSTILE_SECRET_KEY') as string);
    formData.append('response', token);
    if (ip) formData.append('remoteip', ip);

    const url = `https://challenges.cloudflare.com/turnstile/v0/siteverify`;

    const response = await fetch(url, {
      body: formData,
      method: 'POST',
    });

    const data = await response.json();
    if (data.success) return true;
    else {
      console.error('Error verifying captcha token', data);
      return false;
    }
  }
}
