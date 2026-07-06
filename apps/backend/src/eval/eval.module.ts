import { Module } from '@nestjs/common';
import { EvalController } from './eval.controller';
import { EvalService } from './eval.service.js';
import { GeminiService } from '../gemini.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [EvalController],
  providers: [EvalService, GeminiService],
})
export class EvalModule {}
