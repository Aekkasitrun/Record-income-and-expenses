import { IsInt, IsPositive, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubCategoryDto {
  @ApiProperty({ example: 'KFC' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  categoryId: number;
}
