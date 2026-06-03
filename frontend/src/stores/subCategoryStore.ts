import { create } from 'zustand'
import type { SubCategory, CreateSubCategoryPayload, UpdateSubCategoryPayload } from '@/types/category'
import { subCategoryService } from '@/services/subCategoryService'
import { useUiStore } from './uiStore'
import i18n from '@/i18n/index'

interface SubCategoryState {
  subCategories: SubCategory[]
  isLoading: boolean
  fetchSubCategories: (categoryId?: number) => Promise<void>
  createSubCategory: (data: CreateSubCategoryPayload) => Promise<void>
  updateSubCategory: (id: number, data: UpdateSubCategoryPayload) => Promise<void>
  deleteSubCategory: (id: number) => Promise<void>
}

export const useSubCategoryStore = create<SubCategoryState>()((set) => ({
  subCategories: [],
  isLoading: false,

  fetchSubCategories: async (categoryId) => {
    set({ isLoading: true })
    try {
      const subCategories = await subCategoryService.getAll(categoryId)
      set({ subCategories })
    } catch {
      useUiStore.getState().showSnackbar(i18n.t('store.failedLoadSubCategories'), 'error')
    } finally {
      set({ isLoading: false })
    }
  },

  createSubCategory: async (data) => {
    const sub = await subCategoryService.create(data)
    set((s) => ({ subCategories: [...s.subCategories, sub] }))
    useUiStore.getState().showSnackbar(i18n.t('store.subCategoryCreated'), 'success')
  },

  updateSubCategory: async (id, data) => {
    const updated = await subCategoryService.update(id, data)
    set((s) => ({ subCategories: s.subCategories.map((sc) => (sc.id === id ? updated : sc)) }))
    useUiStore.getState().showSnackbar(i18n.t('store.subCategoryUpdated'), 'success')
  },

  deleteSubCategory: async (id) => {
    await subCategoryService.remove(id)
    set((s) => ({ subCategories: s.subCategories.filter((sc) => sc.id !== id) }))
    useUiStore.getState().showSnackbar(i18n.t('store.subCategoryDeleted'), 'success')
  },
}))
