import { useEffect, useMemo, useState } from 'react'
import {
  Box, Typography, Grid, Card, CardContent, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, Tab, Tabs,
} from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import { PieChart } from '@mui/x-charts/PieChart'
import { useTranslation } from 'react-i18next'
import { reportService } from '@/services/reportService'
import { formatCurrencyCompact } from '@/utils/locale'
import type { CategoryReport, YearlyMonthData } from '@/types/report'
import dayjs from 'dayjs'

export default function ReportsPage() {
  const currentYear = dayjs().year()
  const [tab, setTab] = useState(0)
  const [year, setYear] = useState(currentYear)
  const [yearlyData, setYearlyData] = useState<YearlyMonthData[]>([])
  const [expenseByCategory, setExpenseByCategory] = useState<CategoryReport[]>([])
  const [incomeByCategory, setIncomeByCategory] = useState<CategoryReport[]>([])
  const [loading, setLoading] = useState(false)
  const { t, i18n } = useTranslation()

  const MONTHS = useMemo(
    () => Array.from({ length: 12 }, (_, i) => dayjs().month(i).format('MMM')),
    [i18n.language],
  )

  useEffect(() => {
    setLoading(true)
    Promise.all([
      reportService.getYearly(year),
      reportService.getByCategory('EXPENSE'),
      reportService.getByCategory('INCOME'),
    ])
      .then(([yearly, expense, income]) => {
        setYearlyData(yearly.months)
        setExpenseByCategory(expense)
        setIncomeByCategory(income)
      })
      .finally(() => setLoading(false))
  }, [year])

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{t('reports.title')}</Typography>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>{t('reports.yearLabel')}</InputLabel>
          <Select label={t('reports.yearLabel')} value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label={t('reports.tabYearly')} />
        <Tab label={t('reports.tabByCategory')} />
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
      ) : tab === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>{t('reports.incomeVsExpense', { year })}</Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: MONTHS }]}
              series={[
                { data: yearlyData.map((m) => m.income), label: t('reports.seriesIncome'), color: '#2e7d32' },
                { data: yearlyData.map((m) => m.expense), label: t('reports.seriesExpense'), color: '#d32f2f' },
              ]}
              height={350}
              margin={{ left: 80 }}
              yAxis={[{ valueFormatter: (v: number) => formatCurrencyCompact(v) }]}
            />
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="error.main">{t('reports.expensesByCategory')}</Typography>
                {expenseByCategory.length === 0 ? (
                  <Typography color="text.secondary" align="center" sx={{ py: 4 }}>{t('reports.noExpenseData')}</Typography>
                ) : (
                  <PieChart
                    series={[{
                      data: expenseByCategory.map((c, i) => ({
                        id: i,
                        value: c.total,
                        label: c.category.name,
                        color: c.category.color,
                      })),
                      innerRadius: 40,
                    }]}
                    height={300}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="success.main">{t('reports.incomeByCategory')}</Typography>
                {incomeByCategory.length === 0 ? (
                  <Typography color="text.secondary" align="center" sx={{ py: 4 }}>{t('reports.noIncomeData')}</Typography>
                ) : (
                  <PieChart
                    series={[{
                      data: incomeByCategory.map((c, i) => ({
                        id: i,
                        value: c.total,
                        label: c.category.name,
                        color: c.category.color,
                      })),
                      innerRadius: 40,
                    }]}
                    height={300}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
