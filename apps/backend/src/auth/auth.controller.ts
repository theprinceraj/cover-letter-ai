import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalDto, VerifyEmailDto } from './dto';
import { Request as ExpressRequest } from 'express';
import { GetUser } from './decorators/get-user.decorator';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { GuestDocument, UserDocument } from 'src/db/schema';
import { AUTH_PROVIDERS } from '@cover-letter-ai/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup/local')
  signupLocal(@Body() dto: LocalDto, @Req() { socket: { remoteAddress: ip } }: ExpressRequest) {
    if (!ip) throw new UnauthorizedException('Unable to determine client IP address');
    return this.authService.signupLocal(dto, ip);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login/local')
  loginLocal(@Body() dto: LocalDto, @GetUser() user: UserDocument) {
    // LocalDto is not used here, but it is required by the LocalAuthGuard
    return this.authService.loginLocal(user);
  }

  @Post('login/guest')
  loginGuest(@Req() req: ExpressRequest) {
    // Extract real client IP
    const ip =
      (req.headers['x-forwarded-for'] as string) || (req.headers['x-real-ip'] as string) || req.socket.remoteAddress || '127.0.0.1';
    // Handle iPv6 lookup
    const clientIp = ip === '::1' ? '127.0.0.1' : ip.split(',')[0].trim();
    return this.authService.loginGuest(clientIp);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@GetUser() user: UserDocument | GuestDocument) {
    return this.authService.getMe(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto, @GetUser() user: UserDocument | GuestDocument) {
    if (user.provider === AUTH_PROVIDERS.GUEST) throw new UnauthorizedException('Invalid token.');
    return this.authService.verifyEmail(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('resend-verification')
  resendVerification(@GetUser() user: UserDocument | GuestDocument) {
    if (user.provider === AUTH_PROVIDERS.GUEST) throw new UnauthorizedException('Invalid token.');
    return this.authService.resendVerification(user);
  }

  @Get('check-is-alive')
  checkIsAlive() {
    return {
      message: 'Server is alive',
    };
  }
}
