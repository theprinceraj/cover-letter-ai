import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EvalClDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  jobDescription!: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  additionalInfo?: string;
}
