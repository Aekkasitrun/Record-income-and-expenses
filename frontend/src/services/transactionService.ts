import { api } from './api'
import type {
  CreateTransactionPayload,
  Transaction,
  TransactionFilters,
  TransactionListResponse,
  TransactionSummary,
  UpdateTransactionPayload,
} from '@/types/transaction'

export const transactionService = {
  getAll: (filters?: TransactionFilters) =>
    api
      .get<TransactionListResponse>('/transactions', { params: filters })
      .then((r) => r.data),

  getOne: (id: number) => api.get<Transaction>(`/transactions/${id}`).then((r) => r.data),

  getSummary: (startDate?: string, endDate?: string) =>
    api
      .get<TransactionSummary>('/transactions/summary', {
        params: { startDate, endDate },
      })
      .then((r) => r.data),

  create: (data: CreateTransactionPayload) =>
    api.post<Transaction>('/transactions', data).then((r) => r.data),

  update: (id: number, data: UpdateTransactionPayload) =>
    api.patch<Transaction>(`/transactions/${id}`, data).then((r) => r.data),

  remove: (id: number) => api.delete(`/transactions/${id}`).then((r) => r.data),
}
