import {
  IsString, IsOptional, IsNumber, IsDate, IsEnum,
  MaxLength, Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { TransactionType } from './bank-transaction.entity';

export class CreateBankTransactionDto {
  @IsString()
  @MaxLength(50)
  bankCode: string;

  @IsString()
  @MaxLength(20)
  acctNumber: string;

  @IsString()
  @MaxLength(50)
  transPurpose: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  chequeNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  currencyCode?: string;

  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  transactionAmount: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bankCharges?: number;

  @Type(() => Date)
  @IsDate()
  transactionDate: Date;

  @IsString()
  @MaxLength(50)
  transactionBy: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class UpdateBankTransactionDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  transPurpose?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  chequeNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  currencyCode?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bankCharges?: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class SearchBankTransactionDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  bankCode?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  acctNumber?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  currencyCode?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  strYear?: string;
}

export class CreateBankAccountDto {
  @IsString()
  @MaxLength(50)
  bankCode: string;

  @IsString()
  @MaxLength(20)
  acctNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  branchName?: string;

  @IsString()
  @MaxLength(20)
  acctType: string;

  @IsString()
  @MaxLength(20)
  currencyCode: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  balance?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  bankTel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  email?: string;
}

export class UpdateBankAccountDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  branchName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  acctType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  currencyCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  bankTel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  email?: string;
}
