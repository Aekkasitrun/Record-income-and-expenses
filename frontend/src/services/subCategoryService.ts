import { api } from './api'
import type { SubCategory, CreateSubCategoryPayload, UpdateSubCategoryPayload } from '@/types/category'

export const subCategoryService = {
  getAll: (categoryId?: number) =>
    api
      .get<SubCategory[]>('/sub-categories', { params: categoryId ? { categoryId } : {} })
      .then((r) => r.data),

  getOne: (id: number) => api.get<SubCategory>(`/sub-categories/${id}`).then((r) => r.data),

  create: (data: CreateSubCategoryPayload) =>
    api.post<SubCategory>('/sub-categories', data).then((r) => r.data),

  update: (id: number, data: UpdateSubCategoryPayload) =>
    api.patch<SubCategory>(`/sub-categories/${id}`, data).then((r) => r.data),

  remove: (id: number) => api.delete(`/sub-categories/${id}`).then((r) => r.data),
}
