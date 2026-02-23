import {
  IsString, IsOptional, IsNumber, IsBoolean, IsDate,
  IsUUID, MaxLength, Min, IsInt,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateManifestJobDto {
  @IsString()
  jobNo: string;

  @IsString()
  @MaxLength(20)
  hblNo: string;

  @IsUUID()
  houseManifestId: string;

  @IsString()
  @MaxLength(200)
  consigneeDetails: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  noPkg?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  custRefNo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  handCharge?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  netHandCharge?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  grandHandCharge?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  vatAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  nhilAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  gfdAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  covidAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalCBM?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fileDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  paidDate?: Date;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  paidStatus?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  releaseStatus?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  releaseDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  calcStatus?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  incvatStatus?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(225)
  marksNum?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  shipBl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  hblType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  hblTypeRemarks?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  agentDetails?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  agentName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  agentTel?: string;
}

export class UpdateManifestJobDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  consigneeDetails?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  noPkg?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  custRefNo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  handCharge?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  netHandCharge?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  grandHandCharge?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  vatAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  nhilAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  gfdAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  covidAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalCBM?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fileDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  paidDate?: Date;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  paidStatus?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  releaseStatus?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  releaseDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  calcStatus?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  incvatStatus?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(225)
  marksNum?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  shipBl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  hblType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  hblTypeRemarks?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  agentDetails?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  agentName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  agentTel?: string;
}

export class SearchManifestJobDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  jobNo?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  hblNo?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  consigneeDetails?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  custRefNo?: string;

  @IsOptional()
  @Transform(({ value }) => value || undefined)
  @IsUUID()
  houseManifestId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || undefined)
  paidStatus?: boolean;
}
