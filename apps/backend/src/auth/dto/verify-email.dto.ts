import { OTP_CODE_MAX, OTP_CODE_MIN } from '@cover-letter-ai/constants';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
  @Min(OTP_CODE_MIN)
  @Max(OTP_CODE_MAX)
  code: number;
}
