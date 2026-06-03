import { useEffect, useState } from 'react'
import {
  Box, Typography, Button, Card, Table, TableHead, TableRow, TableCell,
  TableBody, IconButton, Chip, CircularProgress, FormControl, InputLabel,
  Select, MenuItem, Pagination, Stack, Tooltip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTranslation } from 'react-i18next'
import { useTransactionStore } from '@/stores/transactionStore'
import { TransactionForm } from '@/components/forms/TransactionForm'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { formatCurrency } from '@/utils/locale'
import type { Transaction } from '@/types/transaction'
import type { TransactionFormData } from '@/schemas/transactionSchema'
import dayjs from 'dayjs'

export default function TransactionsPage() {
  const { transactions, isLoading, total, totalPages, filters, fetchTransactions, createTransaction, updateTransaction, deleteTransaction, setFilters } = useTransactionStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Transaction | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<Transaction | undefined>()
  const { t } = useTranslation()

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

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

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteTransaction(deleteTarget.id)
      setDeleteTarget(undefined)
    }
  }

  const handlePageChange = (_: unknown, page: number) => {
    fetchTransactions({ page })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{t('transactions.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditTarget(undefined); setFormOpen(true) }}>
          {t('transactions.addTransaction')}
        </Button>
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>{t('transactions.filterType')}</InputLabel>
          <Select
            label={t('transactions.filterType')}
            value={filters.type ?? 'ALL'}
            onChange={(e) => {
              const val = e.target.value as 'INCOME' | 'EXPENSE' | 'ALL'
              const type = val === 'ALL' ? undefined : val
              setFilters({ type, page: 1 })
              fetchTransactions({ type, page: 1 })
            }}
          >
            <MenuItem value="ALL">{t('transactions.all')}</MenuItem>
            <MenuItem value="INCOME">{t('transactions.income')}</MenuItem>
            <MenuItem value="EXPENSE">{t('transactions.expense')}</MenuItem>
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
                    <TableCell><CategoryBadge category={tx.category} /></TableCell>
                    <TableCell>{tx.description || '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={tx.type === 'INCOME' ? t('transactions.income') : t('transactions.expense')}
                        color={tx.type === 'INCOME' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: tx.type === 'INCOME' ? 'success.main' : 'error.main' }}>
                      {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell align="center">
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
        onClose={() => { setFormOpen(false); setEditTarget(undefined) }}
        onSubmit={handleSubmit}
        initialData={editTarget}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title={t('transactions.deleteTitle')}
        message={deleteTarget ? t('transactions.deleteMessage', {
          type: deleteTarget.type === 'INCOME' ? t('transactions.income') : t('transactions.expense'),
          amount: formatCurrency(deleteTarget.amount),
        }) : ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(undefined)}
        confirmLabel={t('transactions.tooltipDelete')}
      />
    </Box>
  )
}
