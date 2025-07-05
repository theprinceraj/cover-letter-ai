import { ConflictException, Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { LocalDto } from './dto';
import { AuthProviders } from '@cover-letter-ai/constants';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

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
      provider: AuthProviders.EMAIL,
      ipAddress: ip,
    });
    return this.db.deleteConfidentialData(user); // interceptor implement to replace this
  }

  async loginLocal(user: any): Promise<{ access_token: string }> {
    await this.db.user.updateOne({ id: user.id }, { $push: { lastLogin: new Date() } });
    return this.genJwtToken(user);
  }

  async genJwtToken(user: any): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
