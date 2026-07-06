import { Module } from '@nestjs/common';
import { EvalController } from './eval.controller';
import { EvalService } from './eval.service.js';
import { GeminiService } from '../gemini.service';
import { JwtStrategy } from '../auth/strategies';

@Module({
  controllers: [EvalController],
  providers: [EvalService, GeminiService, JwtStrategy],
})
export class EvalModule {}
