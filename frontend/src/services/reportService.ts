import { api } from './api'
import type { CategoryReport, MonthlyReport, YearlyReport } from '../types/report'
import type { TransactionType } from '@/types/category'

export const reportService = {
  getMonthly: (year: number, month: number) =>
    api.get<MonthlyReport>('/reports/monthly', { params: { year, month } }).then((r) => r.data),

  getYearly: (year: number) =>
    api.get<YearlyReport>('/reports/yearly', { params: { year } }).then((r) => r.data),

  getByCategory: (type: TransactionType, startDate?: string, endDate?: string) =>
    api
      .get<CategoryReport[]>('/reports/by-category', { params: { type, startDate, endDate } })
      .then((r) => r.data),
}
