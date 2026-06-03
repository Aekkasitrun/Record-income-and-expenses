import { Chip } from '@mui/material'
import type { TransactionType } from '@/types/category'
import { formatCurrency } from '@/utils/locale'

interface AmountChipProps {
  amount: number
  type: TransactionType
}

export function AmountChip({ amount, type }: AmountChipProps) {
  const isIncome = type === 'INCOME'
  return (
    <Chip
      label={`${isIncome ? '+' : '-'}${formatCurrency(amount)}`}
      color={isIncome ? 'success' : 'error'}
      size="small"
      variant="outlined"
    />
  )
}
