import { useEffect, useState } from 'react'
import {
  Box, Typography, Button, Card, Table, TableHead, TableRow, TableCell,
  TableBody, IconButton, Chip, CircularProgress, FormControl, InputLabel,
  Select, MenuItem, Pagination, Stack, Tooltip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useTranslation } from 'react-i18next'
import { useTransactionStore } from '@/stores/transactionStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useSubCategoryStore } from '@/stores/subCategoryStore'
import { TransactionForm } from '@/components/forms/TransactionForm'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { formatCurrency } from '@/utils/locale'
import type { Transaction } from '@/types/transaction'
import type { TransactionFormData } from '@/schemas/transactionSchema'
import dayjs from 'dayjs'

export default function TransactionsPage() {
  const { transactions, isLoading, total, totalPages, filters, fetchTransactions, createTransaction, updateTransaction, deleteTransaction, setFilters } = useTransactionStore()
  const { categories, fetchCategories } = useCategoryStore()
  const { subCategories, fetchSubCategories } = useSubCategoryStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Transaction | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<Transaction | undefined>()
  const [cloneSource, setCloneSource] = useState<Partial<TransactionFormData> | undefined>()
  const [filterYear, setFilterYear] = useState<number | null>(null)
  const [filterMonth, setFilterMonth] = useState<number | null>(null)
  const { t } = useTranslation()

  const currentYear = dayjs().year()
  const FIRST_YEAR = 2024
  const yearOptions = Array.from({ length: currentYear - FIRST_YEAR + 1 }, (_, i) => currentYear - i)

  useEffect(() => {
    fetchTransactions()
    fetchCategories()
    fetchSubCategories()
  }, [fetchTransactions, fetchCategories, fetchSubCategories])

  const handleSubmit = async (data: TransactionFormData) => {
    if (editTarget) {
      await updateTransaction(editTarget.id, data)
    } else {
      await createTransaction(data)
    }
    setEditTarget(undefined)
  }

  const handleEdit = (tx: Transaction) => {
    setEditTarget(tx)
    setFormOpen(true)
  }

  const handleClone = (tx: Transaction) => {
    setCloneSource({
      type: tx.type,
      amount: tx.amount,
      categoryId: tx.categoryId,
      subCategoryId: tx.subCategoryId ?? undefined,
      description: tx.description ?? '',
    })
    setEditTarget(undefined)
    setFormOpen(true)
  }

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteTransaction(deleteTarget.id)
      setDeleteTarget(undefined)
    }
  }

  const handlePageChange = (_: unknown, page: number) => {
    fetchTransactions({ page })
  }

  const applyDateFilter = (year: number | null, month: number | null) => {
    if (!year && !month) {
      setFilters({ startDate: undefined, endDate: undefined, page: 1 })
      fetchTransactions({ startDate: undefined, endDate: undefined, page: 1 })
      return
    }
    const y = year ?? currentYear
    const start = month ? dayjs().year(y).month(month - 1).startOf('month') : dayjs().year(y).startOf('year')
    const end = month ? dayjs().year(y).month(month - 1).endOf('month') : dayjs().year(y).endOf('year')
    setFilters({ startDate: start.toISOString(), endDate: end.toISOString(), page: 1 })
    fetchTransactions({ startDate: start.toISOString(), endDate: end.toISOString(), page: 1 })
  }

  const filteredSubCategories = filters.categoryId
    ? subCategories.filter((s) => s.categoryId === filters.categoryId)
    : subCategories

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{t('transactions.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditTarget(undefined); setFormOpen(true) }}>
          {t('transactions.addTransaction')}
        </Button>
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>{t('transactions.filterType')}</InputLabel>
            <Select
              label={t('transactions.filterType')}
              value={filters.type ?? 'ALL'}
              onChange={(e) => {
                const val = e.target.value as 'INCOME' | 'EXPENSE' | 'INVESTMENT' | 'ALL'
                const type = val === 'ALL' ? undefined : val
                setFilters({ type, page: 1, categoryId: undefined, subCategoryId: undefined })
                fetchTransactions({ type, page: 1, categoryId: undefined, subCategoryId: undefined })
              }}
            >
              <MenuItem value="ALL">{t('transactions.all')}</MenuItem>
              <MenuItem value="INCOME">{t('transactions.income')}</MenuItem>
              <MenuItem value="EXPENSE">{t('transactions.expense')}</MenuItem>
              <MenuItem value="INVESTMENT">{t('transactions.investment')}</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>{t('transactions.filterCategory')}</InputLabel>
            <Select
              label={t('transactions.filterCategory')}
              value={filters.categoryId ?? 'ALL'}
              onChange={(e) => {
                const val = e.target.value
                const categoryId = val === 'ALL' ? undefined : Number(val)
                setFilters({ categoryId, page: 1, subCategoryId: undefined })
                fetchTransactions({ categoryId, page: 1, subCategoryId: undefined })
              }}
            >
              <MenuItem value="ALL">{t('transactions.all')}</MenuItem>
              {categories
                .filter((c) => !filters.type || c.type === filters.type)
                .map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
            </Select>
          </FormControl>

          {filteredSubCategories.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>{t('transactions.filterSubCategory')}</InputLabel>
              <Select
                label={t('transactions.filterSubCategory')}
                value={filters.subCategoryId ?? 'ALL'}
                onChange={(e) => {
                  const val = e.target.value
                  const subCategoryId = val === 'ALL' ? undefined : Number(val)
                  setFilters({ subCategoryId, page: 1 })
                  fetchTransactions({ subCategoryId, page: 1 })
                }}
              >
                <MenuItem value="ALL">{t('transactions.all')}</MenuItem>
                {filteredSubCategories.map((sub) => (
                  <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl size="small" sx={{ minWidth: 110 }}>
            <InputLabel>{t('transactions.filterYear')}</InputLabel>
            <Select
              label={t('transactions.filterYear')}
              value={filterYear ?? 'ALL'}
              onChange={(e) => {
                const val = e.target.value
                const year = val === 'ALL' ? null : Number(val)
                setFilterYear(year)
                applyDateFilter(year, filterMonth)
              }}
            >
              <MenuItem value="ALL">{t('transactions.all')}</MenuItem>
              {yearOptions.map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>{t('transactions.filterMonth')}</InputLabel>
            <Select
              label={t('transactions.filterMonth')}
              value={filterMonth ?? 'ALL'}
              onChange={(e) => {
                const val = e.target.value
                const month = val === 'ALL' ? null : Number(val)
                setFilterMonth(month)
                applyDateFilter(filterYear, month)
              }}
            >
              <MenuItem value="ALL">{t('transactions.all')}</MenuItem>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <MenuItem key={m} value={m}>{t(`months.${m}`)}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

      <Card>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('transactions.colDate')}</TableCell>
                <TableCell>{t('transactions.colCategory')}</TableCell>
                <TableCell>{t('transactions.colDescription')}</TableCell>
                <TableCell>{t('transactions.colType')}</TableCell>
                <TableCell align="right">{t('transactions.colAmount')}</TableCell>
                <TableCell align="center">{t('transactions.colActions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    {t('transactions.noTransactions')}
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id} hover>
                    <TableCell>{dayjs(tx.date).format('DD/MM/YYYY')}</TableCell>
                    <TableCell>
                      <CategoryBadge category={tx.category} />
                      {tx.subCategory && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                          · {tx.subCategory.name}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{tx.description || '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          tx.type === 'INCOME' ? t('transactions.income') :
                          tx.type === 'INVESTMENT' ? t('transactions.investment') :
                          t('transactions.expense')
                        }
                        color={tx.type === 'INCOME' ? 'success' : tx.type === 'EXPENSE' ? 'error' : 'default'}
                        size="small"
                        sx={tx.type === 'INVESTMENT' ? { backgroundColor: '#7b1fa2', color: '#fff' } : undefined}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: tx.type === 'INCOME' ? 'success.main' : tx.type === 'INVESTMENT' ? '#7b1fa2' : 'error.main' }}>
                      {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={t('transactions.tooltipClone')}><IconButton size="small" onClick={() => handleClone(tx)}><ContentCopyIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title={t('transactions.tooltipEdit')}><IconButton size="small" onClick={() => handleEdit(tx)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title={t('transactions.tooltipDelete')}><IconButton size="small" color="error" onClick={() => setDeleteTarget(tx)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination count={totalPages} page={filters.page ?? 1} onChange={handlePageChange} color="primary" />
        </Box>
      )}

      <Box sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {t('transactions.totalRecords', { count: total })}
        </Typography>
      </Box>

      <TransactionForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(undefined); setCloneSource(undefined) }}
        onSubmit={handleSubmit}
        initialData={editTarget}
        prefillData={cloneSource}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title={t('transactions.deleteTitle')}
        message={deleteTarget ? t('transactions.deleteMessage', {
          type: deleteTarget.type === 'INCOME' ? t('transactions.income') : deleteTarget.type === 'INVESTMENT' ? t('transactions.investment') : t('transactions.expense'),
          amount: formatCurrency(deleteTarget.amount),
        }) : ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(undefined)}
        confirmLabel={t('transactions.tooltipDelete')}
      />
    </Box>
  )
}
