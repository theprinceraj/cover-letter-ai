import { Body, Controller, Post } from '@nestjs/common';
import { EvalService } from './eval.service';

@Controller('eval')
export class EvalController {
  constructor(private readonly evalService: EvalService) {}

  @Post()
  async eval(@Body() body: { prompt: string }) {
    return 'hi';
  }
}
