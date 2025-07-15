import { EMAIL_MAX_LENGTH, EMAIL_MIN_LENGTH } from '@cover-letter-ai/constants';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LocalDto {
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsEmail()
  @IsNotEmpty()
  @Length(EMAIL_MIN_LENGTH, EMAIL_MAX_LENGTH)
  email!: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  password!: string;
}
