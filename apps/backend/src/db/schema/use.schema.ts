import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { UserModelName } from './user.schema';
import { generateSnowflake } from '../snowflake.util';
import { MAX_JOB_DESCRIPTION_LENGTH, MAX_OTHER_RELEVANT_INFORMATION_LENGTH } from '@cover-letter-ai/constants';

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

  @Prop({ type: SchemaTypes.String, required: true, trim: true, maxlength: MAX_JOB_DESCRIPTION_LENGTH })
  jobDescription!: string;

  @Prop({ type: SchemaTypes.String, required: false, default: '', trim: true, maxlength: MAX_OTHER_RELEVANT_INFORMATION_LENGTH })
  additionalInfo?: string | null;

  @Prop({ type: SchemaTypes.String, required: false, default: null })
  documentUrl?: string | null;

  @Prop({ type: SchemaTypes.String, required: false, default: null })
  documentType?: string | null;

  @Prop({ type: SchemaTypes.String, required: false, default: null, trim: true })
  documentName?: string | null;

  @Prop({ type: SchemaTypes.String, required: true })
  coverLetter!: string;

  @Prop({ type: [SchemaTypes.String], required: true })
  suggestions!: string[];

  @Prop({ type: SchemaTypes.String, required: true, uppercase: true, enum: ['GUEST', 'USER'] })
  type!: 'GUEST' | 'USER';
}

export const UseSchema = SchemaFactory.createForClass(Use);
