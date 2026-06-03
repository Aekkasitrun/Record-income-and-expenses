import { api } from './api'
import type { Category, CreateCategoryPayload, TransactionType, UpdateCategoryPayload } from '@/types/category'

export const categoryService = {
  getAll: (type?: TransactionType) =>
    api.get<Category[]>('/categories', { params: type ? { type } : {} }).then((r) => r.data),

  getOne: (id: number) => api.get<Category>(`/categories/${id}`).then((r) => r.data),

  create: (data: CreateCategoryPayload) =>
    api.post<Category>('/categories', data).then((r) => r.data),

  update: (id: number, data: UpdateCategoryPayload) =>
    api.patch<Category>(`/categories/${id}`, data).then((r) => r.data),

  remove: (id: number) => api.delete(`/categories/${id}`).then((r) => r.data),
}
