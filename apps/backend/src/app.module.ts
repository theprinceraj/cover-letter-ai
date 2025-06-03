import { Module } from '@nestjs/common';
import { EvalModule } from './eval/eval.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), EvalModule],
})
export class AppModule {}
