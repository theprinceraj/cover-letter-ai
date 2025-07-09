import { CREDIT_PACKAGES_ID } from '@cover-letter-ai/constants';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString({
    message: `packageId must be one of the following: ${Object.values(CREDIT_PACKAGES_ID).join(', ')}`,
  })
  packageId!: CREDIT_PACKAGES_ID;

  @IsNotEmpty()
  @IsString()
  currencyCodeInISOFormat!: string;
}

export class VerifyCreditOrderPaymentDto {
  @IsNotEmpty()
  @IsString()
  razorpay_payment_id!: string;

  @IsNotEmpty()
  @IsString()
  razorpay_signature!: string;
}
