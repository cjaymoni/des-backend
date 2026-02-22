import {
  IsString,
  IsOptional,
  IsDate,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateMasterManifestDto {
  @IsString()
  @MaxLength(20)
  blNo: string;

  @IsString()
  @MaxLength(225)
  containerNo: string;

  @IsString()
  @MaxLength(50)
  vessel: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  voyage?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  arrivalDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  rotationDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  destination?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  portLoad?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  shippingLine?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  shipper?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  cntSize?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  sealNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  consignType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  rptNo?: string;
}

export class UpdateMasterManifestDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  blNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(225)
  containerNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  vessel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  voyage?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  arrivalDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  rotationDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  destination?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  portLoad?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  shippingLine?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  shipper?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  cntSize?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  sealNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  consignType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  rptNo?: string;
}

export class SearchMasterManifestDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  blNo?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  vessel?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  shippingLine?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  containerNo?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  shipper?: string;
}
