import { useEffect } from 'react'
import { Grid, Typography, Box, Card, CardContent, Divider, CircularProgress } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import { useTranslation } from 'react-i18next'
import { useTransactionStore } from '@/stores/transactionStore'
import { StatCard } from '@/components/ui/StatCard'
import { AmountChip } from '@/components/ui/AmountChip'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { formatCurrency } from '@/utils/locale'
import dayjs from 'dayjs'

export default function DashboardPage() {
  const { summary, transactions, isLoading, fetchSummary, fetchTransactions } = useTransactionStore()
  const { t } = useTranslation()

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
        {t('dashboard.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('dashboard.overview', { month: dayjs().format('MMMM'), year: dayjs().year() })}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('dashboard.balance')}
            value={formatCurrency(summary?.balance ?? 0)}
            icon={<AccountBalanceWalletIcon fontSize="inherit" />}
            color={summary && summary.balance >= 0 ? 'success.main' : 'error.main'}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('dashboard.totalIncome')}
            value={formatCurrency(summary?.totalIncome ?? 0)}
            icon={<TrendingUpIcon fontSize="inherit" />}
            color="success.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('dashboard.totalExpense')}
            value={formatCurrency(summary?.totalExpense ?? 0)}
            icon={<TrendingDownIcon fontSize="inherit" />}
            color="error.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('dashboard.totalInvestment')}
            value={formatCurrency(summary?.totalInvestment ?? 0)}
            icon={<ShowChartIcon fontSize="inherit" />}
            color="#7b1fa2"
          />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>{t('dashboard.recentTransactions')}</Typography>
          <Divider sx={{ mb: 2 }} />
          {transactions.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              {t('dashboard.noTransactions')}
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
