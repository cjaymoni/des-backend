import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
  IsUUID,
  MaxLength,
  Min,
  IsInt,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateWarehouseJobDto {
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
  @MaxLength(225)
  marksNum?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  containerNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  vessel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  blNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  agentName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  vehNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  declNo?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  transRemarks?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalCBM?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  vatPer?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  vatAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  nhilPer?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  nhilAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  gfdPer?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  gfdAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  covidPer?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  covidAmt?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  cargoType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  cargoTypeLevel?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cargoTypeAmt?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fileDate?: Date;

  @Type(() => Date)
  @IsDate()
  unstuffDate: Date;

  @Type(() => Date)
  @IsDate()
  deliveryDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  arrivalDate?: Date;

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
  incvatStatus?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  vatInvoice?: string;
}

export class UpdateWarehouseJobDto {
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
  @MaxLength(225)
  marksNum?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  containerNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  vessel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  blNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  agentName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  vehNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  declNo?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  transRemarks?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalCBM?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  vatPer?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  vatAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  nhilPer?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  nhilAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  gfdPer?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  gfdAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  covidPer?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  covidAmt?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  cargoType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  cargoTypeLevel?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cargoTypeAmt?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fileDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  unstuffDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deliveryDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  arrivalDate?: Date;

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
  incvatStatus?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  vatInvoice?: string;
}

export class AdditionalRentDto {
  @Type(() => Date)
  @IsDate()
  unstuffDate: Date;

  @Type(() => Date)
  @IsDate()
  deliveryDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  paidDate?: Date;

  /** CBM or Weight — determines rent tariff multiplier */
  @IsOptional()
  @IsString()
  @MaxLength(10)
  rentBasis?: string; // 'CBM' | 'Weight'
}

export class SearchWarehouseJobDto {
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
  @Transform(({ value }) => value || undefined)
  @IsUUID()
  houseManifestId?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : undefined,
  )
  @IsBoolean()
  paidStatus?: boolean;
}
