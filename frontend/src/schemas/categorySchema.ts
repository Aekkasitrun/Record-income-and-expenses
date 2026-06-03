import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.enum(['INCOME', 'EXPENSE']),
  icon: z.string().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color')
    .optional(),
})

export type CategoryFormData = z.infer<typeof categorySchema>
