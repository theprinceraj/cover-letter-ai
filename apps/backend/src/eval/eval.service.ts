import { BadRequestException, Injectable } from '@nestjs/common';
import { GeminiService } from '../gemini.service.js';
import { createPartFromUri, createUserContent, GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION } from './constants.js';
import { AUTH_PROVIDERS, GEMINI_RESPONSE_DELIMITER } from '@cover-letter-ai/constants';
import type { APIResponse } from '@cover-letter-ai/constants';
import { DbService } from 'src/db/db.service';
import { EvalClDto } from './eval-cl.dto.js';
import { UserDocument } from 'src/db/schema/user.schema.js';
import { ConfigService } from '@nestjs/config';
// import { v2 as cloudinary, type ConfigOptions } from 'cloudinary';
import { unlinkSync, writeFileSync } from 'fs';
import { GuestDocument } from 'src/db/schema/guest.schema.js';

// async function uploadSingleFile(file: Express.Multer.File | Buffer, folderPath: string, fileName: string): Promise<string> {
//   const fileBuffer = file instanceof Buffer ? file : (file as Express.Multer.File).buffer;
//   return new Promise<string>((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream(
//         {
//           folder: folderPath,
//           public_id: fileName,
//           use_filename: true,
//           unique_filename: false,
//           resource_type: 'raw',
//         },
//         (err, result) => {
//           if (err) reject(err);
//           resolve(result?.secure_url || '');
//         },
//       )
//       .end(fileBuffer);
//   });
// }

@Injectable()
export class EvalService {
  private readonly ai: GoogleGenAI;

  constructor(
    private readonly gemini: GeminiService,
    private readonly db: DbService,
    readonly config: ConfigService,
  ) {
    this.ai = this.gemini.ai;

    // const options: ConfigOptions = {
    //   cloud_name: config.get('CLOUDINARY_CLOUD_NAME') as string,
    //   api_key: config.get('CLOUDINARY_API_KEY') as string,
    //   api_secret: config.get('CLOUDINARY_API_SECRET') as string,
    //   secure: true,
    // };
    // cloudinary.config(options);
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
    let resumeFileUri: string | null = null;
    if (resume) {
      // resumeFileUri = await this.uploadSingleFile(resume, 'resumes', `${currentUser.email.substring(0, 5)}-${resume.originalname}`);
      const resumeFileLocalTempName = `${currentUser.id.substring(0, 5)}-${resume.originalname}.pdf`;
      writeFileSync(resumeFileLocalTempName, resume.buffer);
      const resumeFile = await this.ai.files.upload({
        file: new Blob([resume.buffer], { type: resume.mimetype }),
      });
      contentParts.push(createPartFromUri(resumeFile.uri || '', resume.mimetype));
      unlinkSync(resumeFileLocalTempName);
    }

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: createUserContent(contentParts),
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });

    if (!response.text) {
      throw new BadRequestException('Failed to generate response from Gemini');
    }

    const splitResponse = response.text?.split(GEMINI_RESPONSE_DELIMITER);
    const coverLetter = splitResponse?.[0]?.trim().replace(/`/g, '');
    const suggestions = splitResponse?.[1]
      ?.trim()
      .split('\n')
      .map((s) => s.trim());

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

    return { coverLetter, suggestions } as APIResponse;
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
