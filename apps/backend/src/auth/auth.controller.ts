import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalDto } from './dto';
import { Request as ExpressRequest } from 'express';
import { GetUser } from './decorators/get-user.decorator';
import { LocalAuthGuard } from './guards';
import { UserDocument } from 'src/db/schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup/local')
  async signupLocal(@Body() dto: LocalDto, @Req() { socket: { remoteAddress: ip } }: ExpressRequest) {
    return this.authService.signupLocal(dto, ip as string);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login/local')
  async loginLocal(@Body() dto: LocalDto, @GetUser() user: UserDocument) {
    // LocalDto is not used here, but it is required by the LocalAuthGuard
    return this.authService.loginLocal(user);
  }
}
