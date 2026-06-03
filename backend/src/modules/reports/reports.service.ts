import { Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMonthly(year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const [transactions, summary] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { date: { gte: start, lte: end } },
        include: { category: true },
        orderBy: { date: 'asc' },
      }),
      this.prisma.transaction.groupBy({
        by: ['type'],
        where: { date: { gte: start, lte: end } },
        _sum: { amount: true },
      }),
    ]);

    const income = summary.find((s) => s.type === TransactionType.INCOME)?._sum.amount ?? 0;
    const expense = summary.find((s) => s.type === TransactionType.EXPENSE)?._sum.amount ?? 0;

    return {
      year,
      month,
      totalIncome: Number(income),
      totalExpense: Number(expense),
      balance: Number(income) - Number(expense),
      transactions: transactions.map((t) => ({ ...t, amount: Number(t.amount) })),
    };
  }

  async getYearly(year: number) {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);

    const transactions = await this.prisma.transaction.findMany({
      where: { date: { gte: start, lte: end } },
      select: { amount: true, type: true, date: true },
    });

    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      income: 0,
      expense: 0,
      balance: 0,
    }));

    for (const tx of transactions) {
      const m = new Date(tx.date).getMonth();
      const amount = Number(tx.amount);
      if (tx.type === TransactionType.INCOME) {
        months[m].income += amount;
      } else {
        months[m].expense += amount;
      }
      months[m].balance = months[m].income - months[m].expense;
    }

    return { year, months };
  }

  async getByCategory(type: TransactionType, startDate?: string, endDate?: string) {
    const where = {
      type,
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {}),
    };

    const [grouped, subGrouped] = await Promise.all([
      this.prisma.transaction.groupBy({
        by: ['categoryId'],
        where,
        _sum: { amount: true },
        _count: { id: true },
        orderBy: { _sum: { amount: 'desc' } },
      }),
      this.prisma.transaction.groupBy({
        by: ['categoryId', 'subCategoryId'],
        where: { ...where, subCategoryId: { not: null } },
        _sum: { amount: true },
        _count: { id: true },
      }),
    ]);

    const categoryIds = grouped.map((g) => g.categoryId);
    const subCategoryIds = subGrouped
      .map((g) => g.subCategoryId)
      .filter((id): id is number => id !== null);

    const [categories, subCategories] = await Promise.all([
      this.prisma.category.findMany({ where: { id: { in: categoryIds } } }),
      this.prisma.subCategory.findMany({ where: { id: { in: subCategoryIds } } }),
    ]);

    const catMap = new Map(categories.map((c) => [c.id, c]));
    const subCatMap = new Map(subCategories.map((s) => [s.id, s]));

    return grouped.map((g) => {
      const subs = subGrouped
        .filter((sg) => sg.categoryId === g.categoryId && sg.subCategoryId !== null)
        .map((sg) => ({
          subCategory: subCatMap.get(sg.subCategoryId!),
          total: Number(sg._sum.amount ?? 0),
          count: sg._count.id,
        }))
        .sort((a, b) => b.total - a.total);

      return {
        category: catMap.get(g.categoryId),
        total: Number(g._sum.amount ?? 0),
        count: g._count.id,
        subCategories: subs,
      };
    });
  }
}
