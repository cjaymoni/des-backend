import { IsString, IsOptional, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateShipperDto {
  @IsString()
  @MaxLength(100)
  name: string;
}

export class UpdateShipperDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}

export class SearchShipperDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  name?: string;
}
