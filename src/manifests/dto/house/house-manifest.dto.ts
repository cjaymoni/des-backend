import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsBoolean,
  IsUUID,
  MaxLength,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

class AttachmentDto {
  @IsString()
  url: string;

  @IsString()
  publicId: string;

  @IsString()
  filename: string;
}

export class CreateHouseManifestDto {
  @IsUUID()
  masterManifestId: string;

  @IsString()
  @MaxLength(20)
  hblNo: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  shipper?: string;

  @IsString()
  description: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  noPkg: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  weight: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalCBM: number;

  @IsOptional()
  @IsString()
  @MaxLength(225)
  marksNum?: string;

  @IsString()
  consignee: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  remark?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  handCharge?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  hblType?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fileDate?: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}

export class UpdateHouseManifestDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  hblNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  shipper?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  noPkg?: number;

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
  @IsString()
  @MaxLength(225)
  marksNum?: string;

  @IsOptional()
  @IsString()
  consignee?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  remark?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  handCharge?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  hblType?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fileDate?: Date;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  releaseStatus?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  releaseDate?: Date;
}

export class SearchHouseManifestDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  hblNo?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  consignee?: string;

  @IsOptional()
  @Transform(({ value }) => value || undefined)
  @IsUUID()
  masterManifestId?: string;
}
