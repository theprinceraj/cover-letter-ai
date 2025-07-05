import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { UserModelName } from './user.schema';
import { generateSnowflake } from '../snowflake.util';

export type UseDocument = HydratedDocument<Use>;
export const UseModelName = 'uses';

@Schema({ timestamps: true })
export class Use {
  @Prop({ type: SchemaTypes.String, required: true, unique: true, default: () => generateSnowflake() })
  id!: string;

  @Prop({ type: SchemaTypes.String, required: true, ref: UserModelName })
  userId!: string;

  @Prop({ type: SchemaTypes.Number, required: true })
  useCount!: number;

  @Prop({ type: SchemaTypes.String, required: true })
  jobDescription!: string;

  @Prop({ type: SchemaTypes.String, required: false, default: '' })
  additionalInfo?: string | null;

  @Prop({ type: SchemaTypes.String, required: false, default: null })
  documentUrl?: string | null;

  @Prop({ type: SchemaTypes.String, required: false, default: null })
  documentType?: string | null;

  @Prop({ type: SchemaTypes.String, required: false, default: null })
  documentName?: string | null;

  @Prop({ type: SchemaTypes.String, required: true })
  coverLetter!: string;

  @Prop({ type: [SchemaTypes.String], required: true })
  suggestions!: string[];

  @Prop({ type: SchemaTypes.String, required: true })
  type!: 'GUEST' | 'USER';
}

export const UseSchema = SchemaFactory.createForClass(Use);
