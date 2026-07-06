import {
  MAX_JOB_DESCRIPTION_LENGTH,
  MAX_OTHER_RELEVANT_INFORMATION_LENGTH,
  MIN_JOB_DESCRIPTION_LENGTH,
  COVER_LETTER_TONES,
  COVER_LETTER_LENGTHS,
  COVER_LETTER_EXPERIENCE_LEVELS,
} from '@cover-letter-ai/constants';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import sanitizeHtml from 'sanitize-html';

const sanitizeMultilineText = (value: unknown): string => {
  const text = typeof value === 'string' ? value : '';
  return text.trim().replace(/\r\n/g, '\n');
};

const sanitizeSingleLineText = (value: unknown): string => {
  const text = typeof value === 'string' ? value : '';
  return sanitizeHtml(text.trim(), { allowedTags: [] });
};

export class EvalClDto {
  @Transform(({ value }: { value: unknown }) => sanitizeMultilineText(value))
  @IsNotEmpty()
  @IsString()
  @Length(MIN_JOB_DESCRIPTION_LENGTH, MAX_JOB_DESCRIPTION_LENGTH, {
    message: `Job description must be between ${MIN_JOB_DESCRIPTION_LENGTH} and ${MAX_JOB_DESCRIPTION_LENGTH} characters`,
  })
  jobDescription!: string;

  @Transform(({ value }: { value: unknown }) => sanitizeMultilineText(value))
  @IsOptional()
  @IsString()
  @Length(0, MAX_OTHER_RELEVANT_INFORMATION_LENGTH, {
    message: `Additional information must be less than ${MAX_OTHER_RELEVANT_INFORMATION_LENGTH} characters`,
  })
  additionalInfo?: string;

  @Transform(({ value }: { value: unknown }) => sanitizeSingleLineText(value))
  @IsString()
  @IsNotEmpty()
  captchaToken!: string;

  @IsOptional()
  @IsEnum(COVER_LETTER_TONES)
  tone?: COVER_LETTER_TONES;

  @IsOptional()
  @IsEnum(COVER_LETTER_LENGTHS)
  length?: COVER_LETTER_LENGTHS;

  @IsOptional()
  @IsEnum(COVER_LETTER_EXPERIENCE_LEVELS)
  experienceLevel?: COVER_LETTER_EXPERIENCE_LEVELS;
}

export class RefineClDto {
  @Transform(({ value }: { value: unknown }) => sanitizeMultilineText(value))
  @IsNotEmpty()
  @IsString()
  coverLetter!: string;

  @Transform(({ value }: { value: unknown }) => sanitizeMultilineText(value))
  @IsNotEmpty()
  @IsString()
  instruction!: string;

  @Transform(({ value }: { value: unknown }) => sanitizeSingleLineText(value))
  @IsString()
  @IsNotEmpty()
  captchaToken!: string;
}

