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
import i18n from '@/i18n/index'

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
      useUiStore.getState().showSnackbar(i18n.t('store.failedLoadTransactions'), 'error')
    } finally {
      set({ isLoading: false })
    }
  },

  fetchSummary: async (startDate, endDate) => {
    try {
      const summary = await transactionService.getSummary(startDate, endDate)
      set({ summary })
    } catch {
      useUiStore.getState().showSnackbar(i18n.t('store.failedLoadSummary'), 'error')
    }
  },

  createTransaction: async (data) => {
    await transactionService.create(data)
    await get().fetchTransactions()
    await get().fetchSummary()
    useUiStore.getState().showSnackbar(i18n.t('store.transactionAdded'), 'success')
  },

  updateTransaction: async (id, data) => {
    await transactionService.update(id, data)
    await get().fetchTransactions()
    await get().fetchSummary()
    useUiStore.getState().showSnackbar(i18n.t('store.transactionUpdated'), 'success')
  },

  deleteTransaction: async (id) => {
    await transactionService.remove(id)
    await get().fetchTransactions()
    await get().fetchSummary()
    useUiStore.getState().showSnackbar(i18n.t('store.transactionDeleted'), 'success')
  },

  setFilters: (filters) => {
    set((s) => ({ filters: { ...s.filters, ...filters } }))
  },
}))
