import { useEffect, useMemo, useState } from 'react'
import {
  Box, Typography, Grid, Card, CardContent, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, Tab, Tabs,
  Collapse, List, ListItem, ListItemText, IconButton, Tooltip,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { BarChart } from '@mui/x-charts/BarChart'
import { PieChart } from '@mui/x-charts/PieChart'
import { useTranslation } from 'react-i18next'
import { reportService } from '@/services/reportService'
import { formatCurrencyCompact, formatCurrency } from '@/utils/locale'
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
  const [expandedCatIds, setExpandedCatIds] = useState<Set<number>>(new Set())
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

  const toggleCatExpand = (id: number) => {
    setExpandedCatIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const renderCategoryList = (data: CategoryReport[]) => (
    <List dense disablePadding>
      {data.map((item) => {
        const expanded = expandedCatIds.has(item.category.id)
        const hasSubs = item.subCategories.length > 0
        return (
          <Box key={item.category.id}>
            <ListItem
              disableGutters
              secondaryAction={
                hasSubs ? (
                  <Tooltip title={expanded ? t('subcategories.collapse') : t('subcategories.expand')}>
                    <IconButton size="small" onClick={() => toggleCatExpand(item.category.id)}>
                      {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                ) : null
              }
            >
              <Box
                sx={{
                  width: 10, height: 10, borderRadius: '50%',
                  backgroundColor: item.category.color, mr: 1.5, flexShrink: 0,
                }}
              />
              <ListItemText
                primary={item.category.name}
                secondary={t('reports.categoryCount', { count: item.count })}
              />
              <Typography variant="body2" sx={{ fontWeight: 'bold', mr: hasSubs ? 4 : 0 }}>
                {formatCurrency(item.total)}
              </Typography>
            </ListItem>
            {hasSubs && (
              <Collapse in={expanded} unmountOnExit>
                <List dense disablePadding sx={{ pl: 3 }}>
                  {item.subCategories.map((sub, i) => (
                    <ListItem key={sub.subCategory?.id ?? i} disableGutters>
                      <ListItemText
                        primary={<Typography variant="body2">{sub.subCategory?.name ?? '—'}</Typography>}
                        secondary={<Typography variant="caption">{t('reports.categoryCount', { count: sub.count })}</Typography>}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatCurrency(sub.total)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        )
      })}
    </List>
  )

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
                  <>
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
                      height={260}
                    />
                    {renderCategoryList(expenseByCategory)}
                  </>
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
                  <>
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
                      height={260}
                    />
                    {renderCategoryList(incomeByCategory)}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
