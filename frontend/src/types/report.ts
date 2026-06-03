import type { Category, SubCategory, TransactionType } from './category'
import type { Transaction } from './transaction'

export interface MonthlyReport {
  year: number
  month: number
  totalIncome: number
  totalExpense: number
  totalInvestment: number
  balance: number
  transactions: Transaction[]
}

export interface YearlyMonthData {
  month: number
  income: number
  expense: number
  investment: number
  balance: number
}

export interface YearlyReport {
  year: number
  months: YearlyMonthData[]
}

export interface SubCategoryReport {
  subCategory: SubCategory | undefined
  total: number
  count: number
}

export interface CategoryReport {
  category: Category
  total: number
  count: number
  subCategories: SubCategoryReport[]
}

export interface ReportFilters {
  type?: TransactionType
  startDate?: string
  endDate?: string
}
