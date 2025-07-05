import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EvalModule } from './eval/eval.module';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '../../../.env'),
    }),
    DbModule,
    AuthModule,
    EvalModule,
  ],
})
export class AppModule {}
