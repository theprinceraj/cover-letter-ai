import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EvalModule } from './eval/eval.module';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '../../../.env'),
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
      errorMessage: 'Too many requests, please try again later.',
    }),
    DbModule,
    AuthModule,
    EvalModule,
  ],
})
export class AppModule {}
