import { IsString, IsOptional, MaxLength, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateImporterExporterDto {
  @IsString()
  code: string;

  @IsString()
  @MaxLength(200)
  ieName: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telephone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  tin?: string;
}

export class UpdateImporterExporterDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  ieName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telephone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  tin?: string;
}

export class SearchImporterExporterDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  ieName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  code?: string;
}
