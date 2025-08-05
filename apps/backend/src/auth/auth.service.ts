import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { LocalDto, VerifyEmailDto } from './dto';
import {
  AUTH_PROVIDERS,
  AuthService_LoginGuest_Response,
  AuthService_LoginLocal_Response,
  AuthService_VerificationEmail_Response,
  DEFAULT_USE_LIMIT_FOR_GUEST,
  DEFAULT_USE_LIMIT_FOR_REGISTERED_USER,
  OTP_CODE_MAX,
  OTP_CODE_MIN,
  OTP_EXPIRATION_TIME_IN_SECONDS,
} from '@cover-letter-ai/constants';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/db/schema';
import { sendMail } from 'src/send-mail.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DbService,
    private readonly jwtService: JwtService,
  ) {}

  async signupLocal(dto: LocalDto, ip: string): Promise<any> {
    const existingUser = await this.db.user.findOne({ email: dto.email });
    if (existingUser) throw new ConflictException('Email already in use');

    const user = await this.db.user.create({
      email: dto.email,
      hash: await bcrypt.hash(dto.password, 10),
      provider: AUTH_PROVIDERS.EMAIL,
      ipAddress: ip,
      useLimit: DEFAULT_USE_LIMIT_FOR_REGISTERED_USER,
    });
    await this.sendOtpMail(dto.email);
    return this.db.deleteConfidentialData(user); // interceptor implement to replace this
  }

  async loginLocal(user: UserDocument): Promise<AuthService_LoginLocal_Response> {
    await this.db.user.updateOne({ id: user.id }, { $push: { lastLogin: new Date() } });
    if (!user.emailVerified) {
      await this.sendOtpMail(user.email);
    }
    return {
      access_token: this.genJwtToken(user),
      user: {
        emailVerified: user.emailVerified,
      },
    } as AuthService_LoginLocal_Response;
  }

  async loginGuest(ip: string): Promise<AuthService_LoginGuest_Response> {
    // Check if guest already exists for this IP
    let guest = await this.db.guest.findOne({ ipAddress: ip });

    if (!guest) {
      // Create new guest user
      guest = await this.db.guest.create({
        ipAddress: ip,
        useLimit: DEFAULT_USE_LIMIT_FOR_GUEST,
      });
    }

    // Generate JWT token for guest
    const token = await this.genGuestJwtToken(guest);

    return {
      access_token: token.access_token,
      guest: {
        id: guest.id,
        ipAddress: guest.ipAddress,
        exhaustedUses: guest.exhaustedUses,
        useLimit: guest.useLimit,
      },
    };
  }

  private genJwtToken(user: any): string {
    const payload = { email: user.email, sub: user._id };
    return this.jwtService.sign(payload);
  }

  private async genGuestJwtToken(guest: any): Promise<{ access_token: string }> {
    const payload = { guestId: guest.id, sub: guest._id, type: AUTH_PROVIDERS.GUEST };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getMe(user: any): Promise<any> {
    if (user.ipAddress && !user.email) {
      return {
        id: user.id,
        ipAddress: user.ipAddress,
        exhaustedUses: user.exhaustedUses,
        useLimit: user.useLimit,
        type: AUTH_PROVIDERS.GUEST,
      };
    }

    return this.db.deleteConfidentialData(user);
  }

  async verifyEmail(dto: VerifyEmailDto, user: UserDocument): Promise<AuthService_VerificationEmail_Response> {
    const otp = await this.db.otp.findOne({ email: user.email, code: dto.code });
    if (!otp) throw new BadRequestException('OTP incorrect or expired. Please request a new one.');
    await this.db.otp.deleteOne({ id: otp.id });
    await this.db.user.updateOne({ id: user.id }, { $set: { emailVerified: true } });
    return {
      success: true,
      message: 'Email verified successfully',
    };
  }

  async resendVerification(user: UserDocument): Promise<AuthService_VerificationEmail_Response> {
    // Check if user is already verified
    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Check for existing OTP and rate limiting
    const existingOtp = await this.db.otp.findOne({ email: user.email });

    if (existingOtp) {
      const timeSinceCreation = Date.now() - new Date(existingOtp['createdAt']).getTime();
      const cooldownPeriod = 60 * 1000; // 1 minute cooldown

      if (timeSinceCreation < cooldownPeriod) {
        const remainingSeconds = Math.ceil((cooldownPeriod - timeSinceCreation) / 1000);
        throw new BadRequestException(`Please wait ${remainingSeconds} seconds before requesting another code`);
      }
    }

    // Send new OTP
    await this.sendOtpMail(user.email);

    return {
      success: true,
      message: 'Verification code sent successfully',
    };
  }

  private async sendOtpMail(email: string): Promise<void> {
    const existingOtp = await this.db.otp.findOne({ email });

    if (existingOtp) {
      // Check if OTP is still valid (not expired)
      const timeSinceCreation = Date.now() - new Date(existingOtp['createdAt']).getTime();
      const otpExpirationMs = OTP_EXPIRATION_TIME_IN_SECONDS * 1000;

      if (timeSinceCreation < otpExpirationMs) {
        // OTP is still valid, resend the same code
        const remainingTimeInMinutes = Math.floor((otpExpirationMs - timeSinceCreation) / 60000);
        await sendMail(
          email,
          `Your Cover Genius Verification Code is ${existingOtp.code.toString()}`,
          existingOtp.code,
          remainingTimeInMinutes,
        );
        return;
      } else {
        // OTP expired, delete it
        await this.db.otp.deleteOne({ id: existingOtp.id });
      }
    }

    // Create new OTP
    const otp = Math.floor(OTP_CODE_MIN + Math.random() * (OTP_CODE_MAX - OTP_CODE_MIN));
    await this.db.otp.create({ email, code: otp });
    await sendMail(email, `Your Cover Genius Verification Code is ${otp}`, otp, OTP_EXPIRATION_TIME_IN_SECONDS / 60);
  }
}
