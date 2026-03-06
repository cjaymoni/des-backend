import { IsString, IsOptional, IsBoolean, IsNumber, MaxLength, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCurrencyDto {
  @IsString()
  @MaxLength(10)
  code: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsNumber()
  @Min(0)
  rate: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  period?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCurrencyDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rate?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  period?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class SearchCurrencyDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  code?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value === undefined ? undefined : value === 'true' || value === true))
  isActive?: boolean;
}
