import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EvalService } from './eval.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('eval')
export class EvalController {
  constructor(private readonly evalService: EvalService) {}

  @Post('cl')
  @UseInterceptors(FileInterceptor('resume'))
  async eval(@Body() body: { jobDescription: string; studentInfo: string }, @UploadedFile() resume: Express.Multer.File) {
    return this.evalService.eval(body.jobDescription, body.studentInfo, resume);
  }
}
