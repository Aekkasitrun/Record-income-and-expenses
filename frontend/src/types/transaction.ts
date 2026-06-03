import type { Category, TransactionType } from './category'

export interface Transaction {
  id: number
  amount: number
  type: TransactionType
  description: string | null
  date: string
  categoryId: number
  category: Category
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
  balance: number
}

export interface TransactionFilters {
  type?: TransactionType
  categoryId?: number
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface CreateTransactionPayload {
  amount: number
  type: TransactionType
  date: string
  categoryId: number
  description?: string
}

export interface UpdateTransactionPayload extends Partial<CreateTransactionPayload> {}
