import { Module } from '@nestjs/common';
import { CreditsController } from './credits.controller';
import { CreditsService } from './credits.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CreditsController],
  providers: [CreditsService],
})
export class CreditsModule {}
