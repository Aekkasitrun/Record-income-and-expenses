import { z } from 'zod'

export const transactionSchema = z.object({
  amount: z
    .number({ error: 'Amount is required' })
    .positive('Amount must be positive')
    .max(999999999999999, 'Amount too large'),
  type: z.enum(['INCOME', 'EXPENSE']),
  date: z.string().min(1, 'Date is required'),
  categoryId: z.number({ error: 'Category is required' }).int().positive(),
  description: z.string().max(500).optional(),
})

export type TransactionFormData = z.infer<typeof transactionSchema>
