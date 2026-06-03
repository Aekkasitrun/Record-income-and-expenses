import { create } from 'zustand'
import type { Category, CreateCategoryPayload, TransactionType, UpdateCategoryPayload } from '@/types/category'
import { categoryService } from '@/services/categoryService'
import { useUiStore } from './uiStore'

interface CategoryState {
  categories: Category[]
  isLoading: boolean
  fetchCategories: (type?: TransactionType) => Promise<void>
  createCategory: (data: CreateCategoryPayload) => Promise<void>
  updateCategory: (id: number, data: UpdateCategoryPayload) => Promise<void>
  deleteCategory: (id: number) => Promise<void>
}

export const useCategoryStore = create<CategoryState>()((set) => ({
  categories: [],
  isLoading: false,

  fetchCategories: async (type) => {
    set({ isLoading: true })
    try {
      const categories = await categoryService.getAll(type)
      set({ categories })
    } catch {
      useUiStore.getState().showSnackbar('Failed to load categories', 'error')
    } finally {
      set({ isLoading: false })
    }
  },

  createCategory: async (data) => {
    const cat = await categoryService.create(data)
    set((s) => ({ categories: [...s.categories, cat] }))
    useUiStore.getState().showSnackbar('Category created', 'success')
  },

  updateCategory: async (id, data) => {
    const updated = await categoryService.update(id, data)
    set((s) => ({ categories: s.categories.map((c) => (c.id === id ? updated : c)) }))
    useUiStore.getState().showSnackbar('Category updated', 'success')
  },

  deleteCategory: async (id) => {
    await categoryService.remove(id)
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }))
    useUiStore.getState().showSnackbar('Category deleted', 'success')
  },
}))
