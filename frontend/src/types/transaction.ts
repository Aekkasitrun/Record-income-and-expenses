import type { Category, SubCategory, TransactionType } from './category'

export interface Transaction {
  id: number
  amount: number
  type: TransactionType
  description: string | null
  date: string
  categoryId: number
  subCategoryId: number | null
  category: Category
  subCategory: SubCategory | null
  createdAt: string
  updatedAt: string
}

export interface TransactionListResponse {
  data: Transaction[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface TransactionSummary {
  totalIncome: number
  totalExpense: number
  totalInvestment: number
  balance: number
}

export interface TransactionFilters {
  type?: TransactionType
  categoryId?: number
  subCategoryId?: number
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
  sortBy?: 'date' | 'createdAt'
  order?: 'asc' | 'desc'
}

export interface CreateTransactionPayload {
  amount: number
  type: TransactionType
  date: string
  categoryId: number
  subCategoryId?: number | null
  description?: string
}

export interface UpdateTransactionPayload extends Partial<CreateTransactionPayload> {}
