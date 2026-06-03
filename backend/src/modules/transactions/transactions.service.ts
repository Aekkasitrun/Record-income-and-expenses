import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryTransactionDto) {
    const { type, categoryId, subCategoryId, startDate, endDate, page = 1, limit = 20 } = query;

    const where: Prisma.TransactionWhereInput = {
      ...(type && { type }),
      ...(categoryId && { categoryId }),
      ...(subCategoryId && { subCategoryId }),
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: { category: true, subCategory: true },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: data.map(this.serialize),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const tx = await this.prisma.transaction.findUnique({
      where: { id },
      include: { category: true, subCategory: true },
    });
    if (!tx) throw new NotFoundException(`Transaction #${id} not found`);
    return this.serialize(tx);
  }

  async getSummary(startDate?: string, endDate?: string) {
    const where: Prisma.TransactionWhereInput =
      startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {};

    const [incomeResult, expenseResult] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { ...where, type: TransactionType.INCOME },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { ...where, type: TransactionType.EXPENSE },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = Number(incomeResult._sum.amount ?? 0);
    const totalExpense = Number(expenseResult._sum.amount ?? 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }

  async create(dto: CreateTransactionDto) {
    const tx = await this.prisma.transaction.create({
      data: {
        amount: dto.amount,
        type: dto.type,
        date: new Date(dto.date),
        categoryId: dto.categoryId,
        subCategoryId: dto.subCategoryId ?? null,
        description: dto.description,
      },
      include: { category: true, subCategory: true },
    });
    return this.serialize(tx);
  }

  async update(id: number, dto: UpdateTransactionDto) {
    await this.findOne(id);
    const tx = await this.prisma.transaction.update({
      where: { id },
      data: {
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.type && { type: dto.type }),
        ...(dto.date && { date: new Date(dto.date) }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...('subCategoryId' in dto && { subCategoryId: dto.subCategoryId ?? null }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
      include: { category: true, subCategory: true },
    });
    return this.serialize(tx);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.transaction.delete({ where: { id } });
  }

  private serialize(tx: {
    id: number;
    amount: Prisma.Decimal | number;
    type: TransactionType;
    description: string | null;
    date: Date;
    categoryId: number;
    subCategoryId?: number | null;
    createdAt: Date;
    updatedAt: Date;
    category?: { id: number; name: string; icon: string; color: string; type: TransactionType };
    subCategory?: { id: number; name: string; categoryId: number } | null;
  }) {
    return {
      ...tx,
      amount: Number(tx.amount),
    };
  }
}
