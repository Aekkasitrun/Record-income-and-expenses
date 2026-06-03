import { Chip } from '@mui/material'
import type { TransactionType } from '@/types/category'

interface AmountChipProps {
  amount: number
  type: TransactionType
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount)

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
