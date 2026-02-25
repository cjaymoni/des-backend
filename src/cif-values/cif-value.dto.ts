import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpsertCifSettingsDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  fobValue: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  frtValue: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  insValue: number;
}

export class CreateCifValueDto {
  @IsString()
  @MaxLength(100)
  jobId: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  refNo?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cifValue: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  fobValue: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  fobP?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  frtValue: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  frtP?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  insValue: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  insP?: number;
}

export class UpdateCifValueDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cifValue?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  fobValue?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  fobP?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  frtValue?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  frtP?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  insValue?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  insP?: number;
}
