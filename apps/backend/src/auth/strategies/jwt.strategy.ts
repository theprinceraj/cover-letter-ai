import { AUTH_PROVIDERS } from '@cover-letter-ai/constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DbService } from 'src/db/db.service';
import { UserDocument, GuestDocument } from 'src/db/schema';

type JwtPayload = {
  sub: string;
  type?: AUTH_PROVIDERS;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    readonly configService: ConfigService,
    private readonly db: DbService,
  ) {
    super({
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<UserDocument | GuestDocument> {
    // Check if this is a guest token
    if (payload.type === AUTH_PROVIDERS.GUEST) {
      const guest = await this.db.guest.findById(payload.sub);
      if (!guest) throw new UnauthorizedException('Invalid guest token.');
      return guest;
    }

    // Regular user token
    const user = await this.db.user.findById(payload.sub);
    if (!user) throw new UnauthorizedException('Invalid token.');
    return user;
  }
}
