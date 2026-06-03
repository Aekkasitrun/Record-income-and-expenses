import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly income/expense breakdown' })
  @ApiQuery({ name: 'year', type: Number })
  @ApiQuery({ name: 'month', type: Number })
  getMonthly(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.reportsService.getMonthly(year, month);
  }

  @Get('yearly')
  @ApiOperation({ summary: 'Get yearly breakdown by month' })
  @ApiQuery({ name: 'year', type: Number })
  getYearly(@Query('year', ParseIntPipe) year: number) {
    return this.reportsService.getYearly(year);
  }

  @Get('by-category')
  @ApiOperation({ summary: 'Get totals grouped by category' })
  @ApiQuery({ name: 'type', enum: TransactionType })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  getByCategory(
    @Query('type') type: TransactionType = TransactionType.EXPENSE,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getByCategory(type, startDate, endDate);
  }
}
