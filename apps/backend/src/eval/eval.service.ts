import { GoogleGenAI } from '@google/genai';
import { AUTH_PROVIDERS, MIN_JOB_DESCRIPTION_LENGTH, SUPPORTED_RESUME_EXTENSIONS } from '@cover-letter-ai/constants';
import type { EvalService_Eval_Response } from '@cover-letter-ai/constants';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GuestDocument, UserDocument } from '../db/schema/index.js';
import { GeminiService } from '../gemini.service.js';
import { getSystemInstruction } from './constants.js';
import { ConfigService } from '@nestjs/config';
import { EvalClDto, RefineClDto } from './eval-cl.dto.js';
import { DbService } from '../db/db.service';
import { parseResume } from './resume-parser.js';

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
    { jobDescription, additionalInfo, captchaToken, tone, length, experienceLevel }: EvalClDto,
    resume: Express.Multer.File,
    currentUser: UserDocument | GuestDocument,
  ) {
    if (!(await this.verifyCaptchaToken(captchaToken, currentUser.ipAddress))) throw new BadRequestException('Invalid captcha token');

    if (currentUser.exhaustedUses >= currentUser.useLimit) throw new BadRequestException('You have exhausted your use limit');

    let resumeText = '';
    if (resume) {
      try {
        resumeText = await parseResume(resume.buffer, resume.mimetype);
      } catch (err) {
        console.error('Error parsing resume file:', err);
        const allowedStr = SUPPORTED_RESUME_EXTENSIONS.map(ext => ext.toUpperCase()).join(', ');
        throw new BadRequestException(`Could not parse your resume file. Please ensure it is a valid ${allowedStr} file.`);
      }
    }

    let textualPrompt = `Job Description:\n${jobDescription}\n\n`;
    if (resumeText) {
      textualPrompt += `Candidate's Resume:\n${resumeText}\n\n`;
    }
    if (additionalInfo) {
      textualPrompt += `Additional Context/Requests:\n${additionalInfo}\n\n`;
    }

    const currentUserId = String(currentUser.id);
    const systemInstruction = getSystemInstruction(tone, length, experienceLevel);

    const response = await this.ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: textualPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            coverLetter: { type: 'STRING' },
            suggestions: {
              type: 'ARRAY',
              items: { type: 'STRING' },
            },
          },
          required: ['coverLetter', 'suggestions'],
        },
      },
    });

    if (!response.text) {
      throw new BadRequestException('Failed to generate response from Gemini');
    }

    const data = JSON.parse(response.text) as { coverLetter: string; suggestions: string[] };

    if (currentUser.provider !== AUTH_PROVIDERS.GUEST) {
      await this.db.user.updateOne({ id: currentUserId }, { $inc: { exhaustedUses: 1 } });
    } else {
      await this.db.guest.updateOne({ id: currentUserId }, { $inc: { exhaustedUses: 1 } });
    }

    await this.db.use.create({
      userId: currentUserId,
      useCount: currentUser.exhaustedUses + 1,
      jobDescription,
      additionalInfo: additionalInfo || '',
      documentUrl: '',
      documentType: resume?.mimetype || 'text/plain',
      documentName: resume?.originalname || 'resume.txt',
      suggestions: data.suggestions,
      coverLetter: data.coverLetter,
      type: currentUser.provider === AUTH_PROVIDERS.GUEST ? 'GUEST' : 'USER',
    });

    return data as EvalService_Eval_Response;
  }

  async refine(
    { coverLetter, instruction, captchaToken }: RefineClDto,
    currentUser: UserDocument | GuestDocument,
  ) {
    if (!(await this.verifyCaptchaToken(captchaToken, currentUser.ipAddress))) throw new BadRequestException('Invalid captcha token');

    if (currentUser.exhaustedUses >= currentUser.useLimit) throw new BadRequestException('You have exhausted your use limit');

    const prompt = `
You are an expert career advisor and editor. You are asked to refine a cover letter based on a specific user instruction.

Original Cover Letter:
"""
${coverLetter}
"""

User Refinement Instruction:
"${instruction}"

Your Task:
1. Rewrite/modify the cover letter according to the user instruction. Keep the changes minimal and targeted, but ensure you satisfy their request.
2. Provide constructive feedback/suggestions for further improvement based on the new content.

Remember:
- Do NOT use markdown formatting in the cover letter.
- Do NOT include bracketed placeholders.
`;

    const currentUserId = String(currentUser.id);

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            coverLetter: { type: 'STRING' },
            suggestions: {
              type: 'ARRAY',
              items: { type: 'STRING' },
            },
          },
          required: ['coverLetter', 'suggestions'],
        },
      },
    });

    if (!response.text) {
      throw new BadRequestException('Failed to generate response from Gemini');
    }

    const data = JSON.parse(response.text) as { coverLetter: string; suggestions: string[] };

    if (currentUser.provider !== AUTH_PROVIDERS.GUEST) {
      await this.db.user.updateOne({ id: currentUserId }, { $inc: { exhaustedUses: 1 } });
    } else {
      await this.db.guest.updateOne({ id: currentUserId }, { $inc: { exhaustedUses: 1 } });
    }

    await this.db.use.create({
      userId: currentUserId,
      useCount: currentUser.exhaustedUses + 1,
      jobDescription: `Refine: ${instruction.substring(0, 100)}`.padEnd(MIN_JOB_DESCRIPTION_LENGTH + 1, '.'),
      additionalInfo: '',
      documentUrl: '',
      documentType: 'text/plain',
      documentName: 'refined_letter.txt',
      suggestions: data.suggestions,
      coverLetter: data.coverLetter,
      type: currentUser.provider === AUTH_PROVIDERS.GUEST ? 'GUEST' : 'USER',
    });

    return data as EvalService_Eval_Response;
  }


  private async verifyCaptchaToken(token: string, ip: string | null | undefined): Promise<boolean> {
    const formData = new FormData();
    formData.append('secret', this.config.getOrThrow<string>('TURNSTILE_SECRET_KEY'));
    formData.append('response', token);
    if (ip) formData.append('remoteip', ip);

    const url = `https://challenges.cloudflare.com/turnstile/v0/siteverify`;

    const response = await fetch(url, {
      body: formData,
      method: 'POST',
    });

    const rawData: unknown = await response.json();
    const data =
      typeof rawData === 'object' &&
        rawData !== null &&
        'success' in rawData &&
        typeof (rawData as { success: unknown }).success === 'boolean'
        ? (rawData as { success: boolean })
        : { success: false };
    if (data.success) return true;
    else {
      console.error('Error verifying captcha token', data);
      return false;
    }
  }
}
