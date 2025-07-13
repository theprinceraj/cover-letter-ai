import { BadRequestException, Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { EvalService } from './eval.service.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards';
import { EvalClDto } from './eval-cl.dto';
import { GuestDocument, UserDocument } from 'src/db/schema';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { memoryStorage } from 'multer';
import { AUTH_PROVIDERS } from '@cover-letter-ai/constants';

@Controller('eval')
export class EvalController {
  constructor(private readonly evalService: EvalService) {}

  @UseGuards(JwtAuthGuard)
  @Post('cl')
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(pdf)$/)) {
          return callback(new Error('Only PDF files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async eval(@Body() body: EvalClDto, @UploadedFile() resume: Express.Multer.File, @GetUser() user: UserDocument | GuestDocument) {
    if (!resume) throw new BadRequestException('Resume is required');
    if (user.provider !== AUTH_PROVIDERS.GUEST && !user.emailVerified)
      throw new BadRequestException('Please verify your email to use the service');
    return this.evalService.eval(body, resume, user);
  }
}
