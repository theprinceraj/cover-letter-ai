import {
  EMAIL_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_DIGITS,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LOWER_CASE_LETTERS,
  PASSWORD_MIN_SPECIAL_CHARACTERS,
  PASSWORD_MIN_UPPER_CASE_LETTERS,
  PASSWORD_TEST_REGEX,
} from '@cover-letter-ai/constants';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class LocalDto {
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  @Length(EMAIL_MIN_LENGTH, EMAIL_MAX_LENGTH)
  email!: string;

  @Transform(({ value }) => value.trim().replace(/\s+/g, '').replace(/\r\n/g, ''))
  @IsNotEmpty()
  @IsString()
  @Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)
  @Matches(PASSWORD_TEST_REGEX, {
    message: `Password must contain at least ${PASSWORD_MIN_UPPER_CASE_LETTERS} uppercase letter, ${PASSWORD_MIN_LOWER_CASE_LETTERS} lowercase letter, ${PASSWORD_MIN_DIGITS} digit, and ${PASSWORD_MIN_SPECIAL_CHARACTERS} special character (!@#$%^&*), with a length of ${PASSWORD_MIN_LENGTH} to ${PASSWORD_MAX_LENGTH} characters`,
  })
  password!: string;
}
