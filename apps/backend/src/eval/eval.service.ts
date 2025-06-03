import { Injectable } from '@nestjs/common';
import { GeminiService } from 'src/gemini.service';
import { createPartFromUri, createUserContent, GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION } from './constants';

@Injectable()
export class EvalService {
  private readonly ai: GoogleGenAI;
  constructor(private readonly gemini: GeminiService) {
    this.ai = gemini.ai;
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
    return response.text;
  }
}
