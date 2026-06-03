import { useEffect } from 'react'
import { Grid, Typography, Box, Card, CardContent, Divider, CircularProgress } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { useTransactionStore } from '@/stores/transactionStore'
import { StatCard } from '@/components/ui/StatCard'
import { AmountChip } from '@/components/ui/AmountChip'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import dayjs from 'dayjs'

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount)

export default function DashboardPage() {
  const { summary, transactions, isLoading, fetchSummary, fetchTransactions } = useTransactionStore()

  useEffect(() => {
    fetchSummary()
    fetchTransactions({ page: 1, limit: 10 })
  }, [fetchSummary, fetchTransactions])

  if (isLoading && !summary) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {dayjs().format('MMMM YYYY')} overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            title="Balance"
            value={formatCurrency(summary?.balance ?? 0)}
            icon={<AccountBalanceWalletIcon fontSize="inherit" />}
            color={summary && summary.balance >= 0 ? 'success.main' : 'error.main'}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            title="Total Income"
            value={formatCurrency(summary?.totalIncome ?? 0)}
            icon={<TrendingUpIcon fontSize="inherit" />}
            color="success.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            title="Total Expense"
            value={formatCurrency(summary?.totalExpense ?? 0)}
            icon={<TrendingDownIcon fontSize="inherit" />}
            color="error.main"
          />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
          <Divider sx={{ mb: 2 }} />
          {transactions.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              No transactions yet. Add your first one!
            </Typography>
          ) : (
            transactions.slice(0, 10).map((tx) => (
              <Box key={tx.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CategoryBadge category={tx.category} />
                  <Box>
                    <Typography variant="body2">{tx.description || tx.category.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(tx.date).format('DD MMM YYYY')}
                    </Typography>
                  </Box>
                </Box>
                <AmountChip amount={tx.amount} type={tx.type} />
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
