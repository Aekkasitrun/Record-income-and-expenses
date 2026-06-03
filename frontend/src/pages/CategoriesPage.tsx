import { useEffect, useState } from 'react'
import {
  Box, Typography, Button, Grid, Card, CardContent, CardActions,
  Chip, IconButton, CircularProgress, Tooltip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Icon from '@mui/material/Icon'
import { useTranslation } from 'react-i18next'
import { useCategoryStore } from '@/stores/categoryStore'
import { CategoryForm } from '@/components/forms/CategoryForm'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useUiStore } from '@/stores/uiStore'
import type { Category } from '@/types/category'
import type { CategoryFormData } from '@/schemas/categorySchema'
import axios from 'axios'

export default function CategoriesPage() {
  const { categories, isLoading, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategoryStore()
  const { showSnackbar } = useUiStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Category | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<Category | undefined>()
  const { t } = useTranslation()

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleSubmit = async (data: CategoryFormData) => {
    if (editTarget) {
      await updateCategory(editTarget.id, data)
    } else {
      await createCategory(data)
    }
    setEditTarget(undefined)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteCategory(deleteTarget.id)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        showSnackbar((err.response?.data as { message?: string })?.message ?? 'Cannot delete', 'error')
      }
    }
    setDeleteTarget(undefined)
  }

  const income = categories.filter((c) => c.type === 'INCOME')
  const expense = categories.filter((c) => c.type === 'EXPENSE')

  const renderSection = (title: string, items: Category[], color: string) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ color }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {items.map((cat) => (
          <Grid key={cat.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card>
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: cat.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon sx={{ color: cat.color }}>{cat.icon}</Icon>
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{cat.name}</Typography>
                </Box>
                {cat.isDefault && <Chip label={t('categories.defaultLabel')} size="small" variant="outlined" />}
              </CardContent>
              <CardActions sx={{ pt: 0, justifyContent: 'flex-end' }}>
                <Tooltip title={t('categories.tooltipEdit')}><IconButton size="small" onClick={() => { setEditTarget(cat); setFormOpen(true) }}><EditIcon fontSize="small" /></IconButton></Tooltip>
                <Tooltip title={t('categories.tooltipDelete')}><IconButton size="small" color="error" onClick={() => setDeleteTarget(cat)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{t('categories.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditTarget(undefined); setFormOpen(true) }}>
          {t('categories.addCategory')}
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
      ) : (
        <>
          {renderSection(t('categories.incomeCategories', { count: income.length }), income, '#2e7d32')}
          {renderSection(t('categories.expenseCategories', { count: expense.length }), expense, '#d32f2f')}
        </>
      )}

      <CategoryForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(undefined) }}
        onSubmit={handleSubmit}
        initialData={editTarget}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title={t('categories.deleteTitle')}
        message={deleteTarget ? t('categories.deleteMessage', { name: deleteTarget.name }) : ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(undefined)}
      />
    </Box>
  )
}
