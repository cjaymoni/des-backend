import {
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateRentChargeDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  dayFrom: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  dayTo: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  unitCharge: number;
}

export class UpdateRentChargeDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  dayFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  dayTo?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  unitCharge?: number;
}
