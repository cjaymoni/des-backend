import {
  IsString, IsOptional, IsNumber, IsBoolean, IsDate,
  MaxLength, Min, IsInt,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateJobDto {
  @IsString()
  jobNo: string;

  @IsString()
  @MaxLength(200)
  ie: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  custRefNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  vesselName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  vesselEta?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  invoiceNo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totDuty?: number;

  @IsOptional()
  @IsString()
  qtyDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  destination?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fileDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  fileDate1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  gcnetJob?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  oic?: string;

  @IsOptional()
  @IsString()
  @MaxLength(225)
  a2IdfNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  boeNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  blNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  transType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  estCompDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  jobFinanceeType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  jobFinanceeName?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  jobFinanceeAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  agencyFee?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  jobStatus?: string;

  @IsOptional()
  @IsString()
  containers?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  cntNo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  totItem?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  vatNhilStatus?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  paidStatus?: boolean;
}

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  ie?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  custRefNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  vesselName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  vesselEta?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  invoiceNo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totDuty?: number;

  @IsOptional()
  @IsString()
  qtyDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  destination?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fileDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  fileDate1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  gcnetJob?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  oic?: string;

  @IsOptional()
  @IsString()
  @MaxLength(225)
  a2IdfNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  boeNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  blNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  transType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  estCompDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  jobFinanceeType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  jobFinanceeName?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  jobFinanceeAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  agencyFee?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  jobStatus?: string;

  @IsOptional()
  @IsString()
  containers?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  cntNo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  totItem?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  vatNhilStatus?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  paidStatus?: boolean;
}

export class SearchJobDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  jobNo?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  ie?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  custRefNo?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  blNo?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  gcnetJob?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  strMonth?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  strYear?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : undefined)
  paidStatus?: boolean;
}
