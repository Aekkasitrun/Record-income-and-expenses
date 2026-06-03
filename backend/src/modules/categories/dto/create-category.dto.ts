import { IsEnum, IsHexColor, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Food & Dining' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiPropertyOptional({ example: 'restaurant' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: '#e65100' })
  @IsOptional()
  @IsHexColor()
  color?: string;
}
