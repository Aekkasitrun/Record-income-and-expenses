import { create } from 'zustand'
import type { Category, CreateCategoryPayload, TransactionType, UpdateCategoryPayload } from '@/types/category'
import { categoryService } from '@/services/categoryService'
import { useUiStore } from './uiStore'
import i18n from '@/i18n/index'

interface CategoryState {
  categories: Category[]
  isLoading: boolean
  fetchCategories: (type?: TransactionType) => Promise<void>
  createCategory: (data: CreateCategoryPayload) => Promise<void>
  updateCategory: (id: number, data: UpdateCategoryPayload) => Promise<void>
  deleteCategory: (id: number) => Promise<void>
  toggleFavourite: (id: number) => Promise<void>
}

export const useCategoryStore = create<CategoryState>()((set, get) => ({
  categories: [],
  isLoading: false,

  fetchCategories: async (type) => {
    set({ isLoading: true })
    try {
      const categories = await categoryService.getAll(type)
      set({ categories })
    } catch {
      useUiStore.getState().showSnackbar(i18n.t('store.failedLoadCategories'), 'error')
    } finally {
      set({ isLoading: false })
    }
  },

  createCategory: async (data) => {
    const cat = await categoryService.create(data)
    set((s) => ({ categories: [...s.categories, cat] }))
    useUiStore.getState().showSnackbar(i18n.t('store.categoryCreated'), 'success')
  },

  updateCategory: async (id, data) => {
    const updated = await categoryService.update(id, data)
    set((s) => ({ categories: s.categories.map((c) => (c.id === id ? updated : c)) }))
    useUiStore.getState().showSnackbar(i18n.t('store.categoryUpdated'), 'success')
  },

  deleteCategory: async (id) => {
    await categoryService.remove(id)
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }))
    useUiStore.getState().showSnackbar(i18n.t('store.categoryDeleted'), 'success')
  },

  toggleFavourite: async (id) => {
    const current = get().categories.find((c) => c.id === id)
    if (!current) return
    const nextValue = !current.isFavourite
    const sort = (arr: Category[]) =>
      [...arr].sort((a, b) => {
        if (a.isFavourite === b.isFavourite) return a.name.localeCompare(b.name)
        return a.isFavourite ? -1 : 1
      })
    set((s) => ({ categories: sort(s.categories.map((c) => c.id === id ? { ...c, isFavourite: nextValue } : c)) }))
    try {
      await categoryService.update(id, { isFavourite: nextValue })
    } catch {
      set((s) => ({ categories: sort(s.categories.map((c) => c.id === id ? { ...c, isFavourite: current.isFavourite } : c)) }))
      useUiStore.getState().showSnackbar(i18n.t('store.categoryFavouriteError'), 'error')
    }
  },
}))
