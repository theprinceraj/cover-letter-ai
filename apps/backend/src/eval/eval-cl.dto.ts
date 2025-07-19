import { MAX_JOB_DESCRIPTION_LENGTH, MAX_OTHER_RELEVANT_INFORMATION_LENGTH, MIN_JOB_DESCRIPTION_LENGTH } from '@cover-letter-ai/constants';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class EvalClDto {
  @Transform(({ value }) =>
    sanitizeHtml(value.trim().replace(/\r\n/g, '\n'), {
      allowedTags: [],
      allowedAttributes: {},
    }),
  )
  @IsNotEmpty()
  @IsString()
  @Length(MIN_JOB_DESCRIPTION_LENGTH, MAX_JOB_DESCRIPTION_LENGTH, {
    message: `Job description must be between ${MIN_JOB_DESCRIPTION_LENGTH} and ${MAX_JOB_DESCRIPTION_LENGTH} characters`,
  })
  jobDescription!: string;

  @Transform(({ value }) =>
    sanitizeHtml(value.trim().replace(/\r\n/g, '\n'), {
      allowedTags: [],
      allowedAttributes: {},
    }),
  )
  @IsOptional()
  @IsString()
  @Length(0, MAX_OTHER_RELEVANT_INFORMATION_LENGTH, {
    message: `Additional information must be less than ${MAX_OTHER_RELEVANT_INFORMATION_LENGTH} characters`,
  })
  additionalInfo?: string;

  @Transform(({ value }) => sanitizeHtml(value.trim(), { allowedTags: [] }))
  @IsString()
  @IsNotEmpty()
  captchaToken!: string;
}
