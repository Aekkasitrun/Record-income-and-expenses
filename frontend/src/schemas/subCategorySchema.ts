import { z } from 'zod'

export const subCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
})

export type SubCategoryFormData = z.infer<typeof subCategorySchema>
