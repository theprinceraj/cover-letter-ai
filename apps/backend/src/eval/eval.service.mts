import { Injectable } from '@nestjs/common';
import { GeminiService } from '../gemini.service.js';
import { createPartFromUri, createUserContent, GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION } from './constants.js';
import { writeFileSync } from 'fs';
import { GEMINI_RESPONSE_DELIMITER } from '@cover-letter-ai/constants';
import type { APIResponse } from '@cover-letter-ai/constants';

@Injectable()
export class EvalService {
  private readonly ai: GoogleGenAI;
  constructor(private readonly gemini: GeminiService) {
    this.ai = this.gemini.ai;
  }

  async eval(jobDescription: string, studentInfo: string, resume: Express.Multer.File) {
    let textualPrompt: string;
    if (!studentInfo) {
      textualPrompt = `Job Description: ${jobDescription}`;
    } else {
      textualPrompt = `Job Description: ${jobDescription}\nMy Relevant Information: ${studentInfo}`;
    }

    const contentParts: any = [textualPrompt];

    if (resume) {
      writeFileSync('resume.pdf', resume.buffer);
      const resumeFile = await this.ai.files.upload({
        file: new Blob([resume.buffer], { type: resume.mimetype }),
      });
      contentParts.push(createPartFromUri(resumeFile.uri!, resumeFile.mimeType!));
    }

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: createUserContent(contentParts),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const splitResponse = response.text?.split(GEMINI_RESPONSE_DELIMITER);
    const coverLetter = splitResponse?.[0]?.trim().replace(/`/g, '');
    const suggestions = splitResponse?.[1]
      ?.trim()
      .split('\n')
      .map((s) => s.trim());
    return { coverLetter, suggestions } as APIResponse;
  }
}
