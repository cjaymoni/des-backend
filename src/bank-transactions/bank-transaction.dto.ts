import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsEnum,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { TransactionType } from './bank-transaction.entity';

export class CreateBankTransactionDto {
  @IsUUID()
  bankAccountId: string;

  @IsString()
  @MaxLength(50)
  transPurpose: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  chequeNo?: string;

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
  @IsUUID()
  @Transform(({ value }) => value || undefined)
  bankAccountId?: string;

  @IsOptional()
  @IsUUID()
  @Transform(({ value }) => value || undefined)
  bankNameId?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  strYear?: string;
}

export class CreateBankAccountDto {
  @IsOptional()
  @IsUUID()
  bankNameId?: string;

  @IsString()
  @MaxLength(20)
  acctNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  branchName?: string;

  @IsOptional()
  @IsUUID()
  acctTypeId?: string;

  @IsOptional()
  @IsUUID()
  currencyId?: string;

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
  @IsUUID()
  bankNameId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  branchName?: string;

  @IsOptional()
  @IsUUID()
  acctTypeId?: string;

  @IsOptional()
  @IsUUID()
  currencyId?: string;

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

export class CreateBankNameDto {
  @IsString()
  @MaxLength(10)
  bankCode: string;

  @IsString()
  @MaxLength(150)
  bankName: string;
}

export class UpdateBankNameDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  bankName?: string;
}

export class CreateLookupDto {
  @IsString()
  @MaxLength(100)
  name: string;
}
