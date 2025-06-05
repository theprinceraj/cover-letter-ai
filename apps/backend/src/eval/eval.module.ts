import { Module } from '@nestjs/common';
import { EvalController } from './eval.controller';
import { EvalService } from './eval.service.mjs';
import { GeminiService } from 'src/gemini.service';

@Module({
  controllers: [EvalController],
  providers: [EvalService, GeminiService],
})
export class EvalModule {}
