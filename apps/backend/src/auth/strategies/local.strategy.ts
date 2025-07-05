import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DbService } from 'src/db/db.service';
import { UserDocument } from 'src/db/schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly db: DbService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<UserDocument> {
    const user = await this.db.user.findOne({ email }).populate('hash');
    if (!user) throw new UnauthorizedException('Invalid email/password combination.');
    const isPasswordValid = await bcrypt.compare(password, user.hash);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid email/password combination.');
    return user;
  }
}
