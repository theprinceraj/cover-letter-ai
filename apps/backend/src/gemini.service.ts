import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
  public readonly ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    this.ai = new GoogleGenAI({ apiKey: this.configService.get<string>('GEMINI_API_KEY') });
  }
}
