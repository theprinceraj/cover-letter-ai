import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { UserModelName } from './user.schema';
import { ACCEPTED_CURRENCY_CODES, CREDIT_ORDER_STATUS, PAYMENT_GATEWAYS } from '@cover-letter-ai/constants';

export type CreditOrderDocument = HydratedDocument<CreditOrder>;
export const CreditOrderModelName = 'credit_orders';

@Schema()
export class CreditOrder {
  @Prop({ type: SchemaTypes.String, required: true, unique: true })
  id!: string; // Razorpay order id

  @Prop({ type: SchemaTypes.String, required: true, ref: UserModelName })
  userId!: string;

  /**
   * Amount to be paid, in the smallest currency unit (e.g., paise, cents)
   */
  @Prop({ type: SchemaTypes.Number, required: true, min: 0 })
  amountToBePaidInMinorUnits!: number;

  @Prop({ type: SchemaTypes.String, required: true, uppercase: true, enum: ACCEPTED_CURRENCY_CODES })
  currency!: ACCEPTED_CURRENCY_CODES;

  @Prop({ type: SchemaTypes.String, required: true, enum: CREDIT_ORDER_STATUS })
  status!: CREDIT_ORDER_STATUS;

  @Prop({ type: SchemaTypes.String, required: false, default: null })
  paymentId?: string | null;

  @Prop({ type: SchemaTypes.Date, required: false, default: null })
  paymentVerifiedAt?: Date | null;

  @Prop({ type: SchemaTypes.String, required: false })
  receipt?: string;

  @Prop({ type: SchemaTypes.Mixed, required: true, default: {} })
  notes!: Record<string, string>;

  @Prop({ type: SchemaTypes.Date, required: true })
  orderCreatedAt!: Date;

  @Prop({ type: SchemaTypes.String, required: true, enum: PAYMENT_GATEWAYS })
  gateway!: PAYMENT_GATEWAYS;
}

export const CreditOrderSchema = SchemaFactory.createForClass(CreditOrder);
