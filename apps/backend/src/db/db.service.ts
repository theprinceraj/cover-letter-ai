import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GuestDocument, GuestModelName, UseDocument, UseModelName, UserDocument, UserModelName } from './schema';
import { isValidSnowflakeUtil } from './snowflake.util';

@Injectable()
export class DbService {
  readonly user: Model<UserDocument>;
  readonly use: Model<UseDocument>;
  readonly guest: Model<GuestDocument>;

  constructor(
    @InjectModel(UserModelName) private readonly userModel: Model<UserDocument>,
    @InjectModel(UseModelName) private readonly useModel: Model<UseDocument>,
    @InjectModel(GuestModelName) private readonly guestModel: Model<GuestDocument>,
  ) {
    this.user = this.userModel;
    this.use = this.useModel;
    this.guest = this.guestModel;
  }

  /**
   * Removes sensitive information from a user document
   * @param user - The user document containing all fields
   * @returns User object with confidential fields (hash, ipAddress) removed
   */
  public deleteConfidentialData(user: UserDocument): any {
    if (!user.hash && !user.ipAddress) return user;
    const { hash, ipAddress, ...userWithoutConfidentialData } = user.toObject();
    return userWithoutConfidentialData;
  }

  public isValidSnowflake(id: string): boolean {
    return isValidSnowflakeUtil(id);
  }
}
