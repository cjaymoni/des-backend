import {
  IsUUID,
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
  IsArray,
  ValidateNested,
  ArrayMaxSize,
  Min,
  MaxLength,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { CalcMode } from './principal-charge-type.entity';

const CALC_MODES: CalcMode[] = ['MIN_MAX', 'MAX', 'FIXED'];

export class ChargeTypeDto {
  @IsString()
  @MaxLength(50)
  chargeType: string;

  @IsIn(CALC_MODES)
  calcMode: CalcMode;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fixedValue?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class UpsertPrincipalChargeSetupDto {
  @IsUUID()
  principalId: string;

  @IsUUID()
  currencyId: string;

  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => ChargeTypeDto)
  chargeTypes: ChargeTypeDto[];
}
