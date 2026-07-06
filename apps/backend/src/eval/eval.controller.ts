import { BadRequestException, Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { EvalService } from './eval.service.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards';
import { EvalClDto, RefineClDto } from './eval-cl.dto.js';
import { GuestDocument, UserDocument } from '../db/schema/index.js';
import { GetUser } from '../auth/decorators/get-user.decorator.js';
import { memoryStorage } from 'multer';
import { AUTH_PROVIDERS, isSupportedResumeFile, SUPPORTED_RESUME_EXTENSIONS } from '@cover-letter-ai/constants';

@Controller('eval')
export class EvalController {
  constructor(private readonly evalService: EvalService) {}

  @UseGuards(JwtAuthGuard)
  @Post('cl')
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        if (!isSupportedResumeFile(file.originalname, file.mimetype)) {
          const allowedStr = SUPPORTED_RESUME_EXTENSIONS.map((ext) => ext.toUpperCase()).join(', ');
          return callback(new Error(`Only ${allowedStr} files are allowed!`), false);
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

  @UseGuards(JwtAuthGuard)
  @Post('refine')
  async refine(@Body() body: RefineClDto, @GetUser() user: UserDocument | GuestDocument) {
    if (user.provider !== AUTH_PROVIDERS.GUEST && !user.emailVerified)
      throw new BadRequestException('Please verify your email to use the service');
    return this.evalService.refine(body, user);
  }
}

