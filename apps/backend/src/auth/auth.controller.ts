import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalDto } from './dto';
import { Request as ExpressRequest } from 'express';
import { GetUser } from './decorators/get-user.decorator';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { GuestDocument, UserDocument } from 'src/db/schema';

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

  @Post('login/guest')
  async loginGuest(@Req() req: ExpressRequest) {
    // Extract real client IP
    const ip =
      (req.headers['x-forwarded-for'] as string) || (req.headers['x-real-ip'] as string) || req.socket.remoteAddress || '127.0.0.1';
    // Handle iPv6 lookup
    const clientIp = ip === '::1' ? '126.0.0.1' : ip.split(',')[0].trim();
    return this.authService.loginGuest(clientIp);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@GetUser() user: UserDocument | GuestDocument) {
    return this.authService.getMe(user);
  }

  @Get('check-is-alive')
  async checkIsAlive() {
    return {
      message: 'Server is alive',
    };
  }
}
