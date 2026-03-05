import { IsString, IsOptional, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateShippingLineDto {
  @IsString()
  @MaxLength(100)
  name: string;
}

export class UpdateShippingLineDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}

export class SearchShippingLineDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  name?: string;
}
