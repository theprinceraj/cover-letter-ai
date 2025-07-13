import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { generateSnowflake } from '../snowflake.util';
import { EMAIL_MAX_LENGTH, EMAIL_MIN_LENGTH, OTP_CODE_MAX, OTP_CODE_MIN, OTP_EXPIRATION_TIME_IN_SECONDS } from '@cover-letter-ai/constants';

export type OtpDocument = HydratedDocument<Otp>;
export const OtpModelName = 'otps';

@Schema({ timestamps: true, expires: OTP_EXPIRATION_TIME_IN_SECONDS })
export class Otp {
  @Prop({ type: SchemaTypes.String, required: true, unique: true, default: () => generateSnowflake() })
  id!: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    maxlength: EMAIL_MAX_LENGTH,
    minlength: EMAIL_MIN_LENGTH,
  })
  email!: string;

  @Prop({ type: SchemaTypes.Number, required: true, min: OTP_CODE_MIN, max: OTP_CODE_MAX, trim: true })
  code!: number;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
