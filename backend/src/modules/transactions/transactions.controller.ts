import {
  Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'List transactions with optional filters and pagination' })
  findAll(@Query() query: QueryTransactionDto) {
    return this.transactionsService.findAll(query);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get balance summary (total income, expense, balance)' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  getSummary(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.transactionsService.getSummary(startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  create(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a transaction' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTransactionDto) {
    return this.transactionsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.remove(id);
  }
}
