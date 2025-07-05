import { Module } from '@nestjs/common';
import { EvalController } from './eval.controller';
import { EvalService } from './eval.service.js';
import { GeminiService } from 'src/gemini.service';
import { JwtStrategy } from 'src/auth/strategies';

@Module({
  controllers: [EvalController],
  providers: [EvalService, GeminiService, JwtStrategy],
})
export class EvalModule {}
