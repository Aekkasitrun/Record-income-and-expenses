import { IsEnum, IsInt, IsISO8601, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @ApiProperty({ example: 50000.00, description: 'Amount (positive, max 2 decimal places)' })
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Max(999999999999999)
  amount: number;

  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: '2026-06-01T00:00:00.000Z' })
  @IsISO8601()
  date: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  categoryId: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  subCategoryId?: number;

  @ApiPropertyOptional({ example: 'Monthly salary' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
