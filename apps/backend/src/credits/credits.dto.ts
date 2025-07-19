import { CREDIT_PACKAGES_ID } from '@cover-letter-ai/constants';
import { IsIn, IsNotEmpty, IsString, Length } from 'class-validator';
import { IsRazorpayPaymentId } from './is-razorpay-pay-id.validator';
import * as sanitizeHtml from 'sanitize-html';
import { Transform } from 'class-transformer';

export class CreateOrderDto {
  @Transform(({ value }) =>
    sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {},
    }),
  )
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(CREDIT_PACKAGES_ID), {
    message: `packageId must be one of the following: ${Object.values(CREDIT_PACKAGES_ID).join(', ')}`,
  })
  packageId!: CREDIT_PACKAGES_ID;

  @Transform(({ value }) =>
    sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {},
    }),
  )
  @IsNotEmpty()
  @IsString()
  @Length(3, 3, {
    message: `Currency code in ISO format must be 3 characters long`,
  })
  currencyCodeInISOFormat!: string;
}

export class VerifyCreditOrderPaymentDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) =>
    sanitizeHtml(value.trim().toLowerCase(), {
      allowedTags: [],
      allowedAttributes: {},
    }),
  )
  @IsRazorpayPaymentId()
  razorpay_payment_id!: string;

  @IsNotEmpty()
  @IsString()
  razorpay_signature!: string;
}
