import { AUTH_PROVIDERS, DEFAULT_USE_LIMIT_FOR_REGISTERED_USER } from '@cover-letter-ai/constants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { generateSnowflake } from '../snowflake.util';

export type UserDocument = HydratedDocument<User>;
export const UserModelName = 'users';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: SchemaTypes.String, required: true, unique: true, default: () => generateSnowflake() })
  id!: string;

  @Prop({ type: SchemaTypes.String, required: true, unique: true })
  email: string;

  @Prop({ type: SchemaTypes.String, required: true, select: false })
  hash: string;

  @Prop({ type: SchemaTypes.Number, required: true, default: 0 })
  exhaustedUses!: number;

  @Prop({ type: SchemaTypes.Number, required: true, default: DEFAULT_USE_LIMIT_FOR_REGISTERED_USER })
  useLimit!: number;

  @Prop({ type: SchemaTypes.String, required: true, default: AUTH_PROVIDERS.EMAIL })
  provider!: AUTH_PROVIDERS;

  @Prop({ type: SchemaTypes.Boolean, required: true, default: false, select: false })
  isDisabled!: boolean;

  @Prop({ type: SchemaTypes.String, required: false, default: null, select: false })
  ipAddress?: string | null;

  @Prop({ type: [SchemaTypes.Date], required: true, default: () => [new Date()] })
  lastLogin!: Date[];
}

export const UserSchema = SchemaFactory.createForClass(User);
