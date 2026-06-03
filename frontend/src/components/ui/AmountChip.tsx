import { Chip } from '@mui/material'
import type { TransactionType } from '@/types/category'
import { formatCurrency } from '@/utils/locale'

interface AmountChipProps {
  amount: number
  type: TransactionType
}

export function AmountChip({ amount, type }: AmountChipProps) {
  const isIncome = type === 'INCOME'
  const isInvestment = type === 'INVESTMENT'
  return (
    <Chip
      label={`${isIncome ? '+' : '-'}${formatCurrency(amount)}`}
      color={isIncome ? 'success' : isInvestment ? 'default' : 'error'}
      size="small"
      variant="outlined"
      sx={isInvestment ? { borderColor: '#7b1fa2', color: '#7b1fa2' } : undefined}
    />
  )
}
