import {
  IsString, IsOptional, IsNumber, IsDate, MaxLength, Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateIncomeExpenditureDto {
  @IsString()
  transRemarks: string;

  @IsString()
  @MaxLength(20)
  transType: string;

  @IsOptional()
  @IsString()
  purposeCode?: string;

  @IsOptional()
  @IsString()
  detailCode?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  incomeAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  netIncome?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  netIncVat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  expenseAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  netExpense?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  netExpVat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bbfAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  incCheqAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  expCheqAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  incCheqVat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  expCheqVat?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  payTerms?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  vatNhilStatus?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  consignee?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  hbl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  agentDetails?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  transactionDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  strMonth?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4)
  dateYear?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  transBy?: string;
}

export class UpdateIncomeExpenditureDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  transType?: string;

  @IsOptional()
  @IsString()
  purposeCode?: string;

  @IsOptional()
  @IsString()
  detailCode?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  incomeAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  netIncome?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  netIncVat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  expenseAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  netExpense?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  netExpVat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bbfAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  incCheqAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  expCheqAmt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  incCheqVat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  expCheqVat?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  payTerms?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  vatNhilStatus?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  consignee?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  hbl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  agentDetails?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  transactionDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  strMonth?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4)
  dateYear?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  transBy?: string;
}

export class SearchIncomeExpenditureDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  transRemarks?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  transType?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  consignee?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  hbl?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  strMonth?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  dateYear?: string;
}
