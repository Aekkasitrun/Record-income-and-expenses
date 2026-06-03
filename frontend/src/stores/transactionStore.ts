import { create } from 'zustand'
import type {
  CreateTransactionPayload,
  Transaction,
  TransactionFilters,
  TransactionSummary,
  UpdateTransactionPayload,
} from '@/types/transaction'
import { transactionService } from '@/services/transactionService'
import { useUiStore } from './uiStore'

interface TransactionState {
  transactions: Transaction[]
  total: number
  totalPages: number
  summary: TransactionSummary | null
  isLoading: boolean
  filters: TransactionFilters
  fetchTransactions: (filters?: TransactionFilters) => Promise<void>
  fetchSummary: (startDate?: string, endDate?: string) => Promise<void>
  createTransaction: (data: CreateTransactionPayload) => Promise<void>
  updateTransaction: (id: number, data: UpdateTransactionPayload) => Promise<void>
  deleteTransaction: (id: number) => Promise<void>
  setFilters: (filters: Partial<TransactionFilters>) => void
}

export const useTransactionStore = create<TransactionState>()((set, get) => ({
  transactions: [],
  total: 0,
  totalPages: 0,
  summary: null,
  isLoading: false,
  filters: { page: 1, limit: 20 },

  fetchTransactions: async (filters) => {
    const merged = { ...get().filters, ...filters }
    set({ isLoading: true, filters: merged })
    try {
      const result = await transactionService.getAll(merged)
      set({ transactions: result.data, total: result.total, totalPages: result.totalPages })
    } catch {
      useUiStore.getState().showSnackbar('Failed to load transactions', 'error')
    } finally {
      set({ isLoading: false })
    }
  },

  fetchSummary: async (startDate, endDate) => {
    try {
      const summary = await transactionService.getSummary(startDate, endDate)
      set({ summary })
    } catch {
      useUiStore.getState().showSnackbar('Failed to load summary', 'error')
    }
  },

  createTransaction: async (data) => {
    await transactionService.create(data)
    await get().fetchTransactions()
    await get().fetchSummary()
    useUiStore.getState().showSnackbar('Transaction added', 'success')
  },

  updateTransaction: async (id, data) => {
    await transactionService.update(id, data)
    await get().fetchTransactions()
    await get().fetchSummary()
    useUiStore.getState().showSnackbar('Transaction updated', 'success')
  },

  deleteTransaction: async (id) => {
    await transactionService.remove(id)
    await get().fetchTransactions()
    await get().fetchSummary()
    useUiStore.getState().showSnackbar('Transaction deleted', 'success')
  },

  setFilters: (filters) => {
    set((s) => ({ filters: { ...s.filters, ...filters } }))
  },
}))
