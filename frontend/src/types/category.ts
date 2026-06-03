export type TransactionType = 'INCOME' | 'EXPENSE'

export interface Category {
  id: number
  name: string
  type: TransactionType
  icon: string
  color: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface SubCategory {
  id: number
  name: string
  categoryId: number
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryPayload {
  name: string
  type: TransactionType
  icon?: string
  color?: string
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {}

export interface CreateSubCategoryPayload {
  name: string
  categoryId: number
}

export interface UpdateSubCategoryPayload extends Partial<CreateSubCategoryPayload> {}
