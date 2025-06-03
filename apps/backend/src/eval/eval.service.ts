import { Injectable } from '@nestjs/common';
import { GeminiService } from 'src/gemini.service';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class EvalService {
  private readonly ai: GoogleGenAI;
  constructor(private readonly gemini: GeminiService) {
    this.ai = gemini.ai;
  }

  async eval(prompt: string) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: 'Explain how AI can be used to improve the quality of life for the elderly.',
    });
    return response.text;
  }
}
