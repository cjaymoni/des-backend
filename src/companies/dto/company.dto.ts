import { IsString, IsEmail, IsOptional, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCompanyDto {
  @IsString()
  appSubdomain: string;

  @IsString()
  companyName: string;

  @IsString()
  companyTIN: string;

  @IsString()
  address: string;

  @IsString()
  location: string;

  @IsString()
  telephone: string;

  @IsOptional()
  @IsString()
  fax?: string;

  @IsEmail()
  email: string;

  @IsDecimal()
  vatPer: string;

  @IsDecimal()
  nhilPer: string;

  @IsDecimal()
  gfdPer: string;

  @IsDecimal()
  covidPer: string;

  @IsString()
  cbm: string;

  @IsOptional()
  @IsString()
  signature?: string;

  @IsOptional()
  @IsString()
  declFoot?: string;

  @IsOptional()
  @IsString()
  maniFoot?: string;

  @IsOptional()
  @IsString()
  rentFoot?: string;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  @IsString()
  logo?: string;
}

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  fax?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDecimal()
  vatPer?: string;

  @IsOptional()
  @IsDecimal()
  nhilPer?: string;

  @IsOptional()
  @IsDecimal()
  gfdPer?: string;

  @IsOptional()
  @IsDecimal()
  covidPer?: string;

  @IsOptional()
  @IsString()
  signature?: string;

  @IsOptional()
  @IsString()
  declFoot?: string;

  @IsOptional()
  @IsString()
  maniFoot?: string;

  @IsOptional()
  @IsString()
  rentFoot?: string;

  @IsOptional()
  @IsString()
  logo?: string;
}
