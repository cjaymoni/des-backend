import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

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

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalCharge?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dangerousCargoI?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dangerousCargoII?: number;
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

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalCharge?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dangerousCargoI?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dangerousCargoII?: number;
}
