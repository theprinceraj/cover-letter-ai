import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { generateSnowflake } from '../snowflake.util';

export type GuestDocument = HydratedDocument<Guest>;
export const GuestModelName = 'guests';

@Schema({ timestamps: true })
export class Guest {
  @Prop({ type: SchemaTypes.String, required: true, unique: true, default: () => generateSnowflake() })
  id!: string;

  @Prop({ type: SchemaTypes.String, required: true })
  ipAddress!: string;

  @Prop({ type: SchemaTypes.Number, required: true, default: 0 })
  exhaustedUses!: number;

  @Prop({ type: SchemaTypes.Number, required: true, default: 1 })
  useLimit!: number;

  @Prop({ type: SchemaTypes.String, required: true, default: 'GUEST' })
  provider!: 'GUEST';
}

export const GuestSchema = SchemaFactory.createForClass(Guest);
