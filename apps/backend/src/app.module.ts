import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EvalModule } from './eval/eval.module';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CreditsModule } from './credits/credits.module';
import { APP_GUARD } from '@nestjs/core';

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
    CreditsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
