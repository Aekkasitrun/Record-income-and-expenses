import { useEffect, useState } from 'react'
import {
  Box, Typography, Button, Grid, Card, CardContent, CardActions,
  Chip, IconButton, CircularProgress, Tooltip, Collapse, List,
  ListItem, ListItemText, ListItemSecondaryAction, Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useTranslation } from 'react-i18next'
import { ICON_MAP } from '@/utils/iconMap'
import { useCategoryStore } from '@/stores/categoryStore'
import { useSubCategoryStore } from '@/stores/subCategoryStore'
import { CategoryForm } from '@/components/forms/CategoryForm'
import { SubCategoryForm } from '@/components/forms/SubCategoryForm'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useUiStore } from '@/stores/uiStore'
import type { Category, SubCategory } from '@/types/category'
import type { CategoryFormData } from '@/schemas/categorySchema'
import type { SubCategoryFormData } from '@/schemas/subCategorySchema'
import axios from 'axios'

export default function CategoriesPage() {
  const { categories, isLoading, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategoryStore()
  const { subCategories, fetchSubCategories, createSubCategory, updateSubCategory, deleteSubCategory } = useSubCategoryStore()
  const { showSnackbar } = useUiStore()

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Category | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<Category | undefined>()

  const [subFormOpen, setSubFormOpen] = useState(false)
  const [subEditTarget, setSubEditTarget] = useState<SubCategory | undefined>()
  const [subDeleteTarget, setSubDeleteTarget] = useState<SubCategory | undefined>()
  const [subFormCategoryId, setSubFormCategoryId] = useState<number | undefined>()

  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  const { t } = useTranslation()

  useEffect(() => {
    fetchCategories()
    fetchSubCategories()
  }, [fetchCategories, fetchSubCategories])

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

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

  const handleSubSubmit = async (data: SubCategoryFormData) => {
    if (subEditTarget) {
      await updateSubCategory(subEditTarget.id, { name: data.name })
    } else if (subFormCategoryId) {
      await createSubCategory({ name: data.name, categoryId: subFormCategoryId })
    }
    setSubEditTarget(undefined)
    setSubFormCategoryId(undefined)
  }

  const handleSubDelete = async () => {
    if (!subDeleteTarget) return
    try {
      await deleteSubCategory(subDeleteTarget.id)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        showSnackbar((err.response?.data as { message?: string })?.message ?? 'Cannot delete', 'error')
      }
    }
    setSubDeleteTarget(undefined)
  }

  const income = categories.filter((c) => c.type === 'INCOME')
  const expense = categories.filter((c) => c.type === 'EXPENSE')

  const renderSection = (title: string, items: Category[], color: string) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ color }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {items.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] ?? ICON_MAP['category']!
          const catSubs = subCategories.filter((s) => s.categoryId === cat.id)
          const expanded = expandedIds.has(cat.id)

          return (
            <Grid key={cat.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card>
                <CardContent sx={{ pb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: cat.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconComponent sx={{ color: cat.color }} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', flex: 1 }}>{cat.name}</Typography>
                  </Box>
                  {cat.isDefault && <Chip label={t('categories.defaultLabel')} size="small" variant="outlined" sx={{ mb: 1 }} />}
                  {catSubs.length > 0 && (
                    <Chip
                      label={t('subcategories.count', { count: catSubs.length })}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  )}
                </CardContent>
                <CardActions sx={{ pt: 0, justifyContent: 'flex-end' }}>
                  <Tooltip title={t('subcategories.manage')}>
                    <IconButton size="small" onClick={() => toggleExpand(cat.id)}>
                      {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('categories.tooltipEdit')}><IconButton size="small" onClick={() => { setEditTarget(cat); setFormOpen(true) }}><EditIcon fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title={t('categories.tooltipDelete')}><IconButton size="small" color="error" onClick={() => setDeleteTarget(cat)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                </CardActions>

                <Collapse in={expanded} unmountOnExit>
                  <Divider />
                  <Box sx={{ px: 2, py: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('subcategories.title')}
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => { setSubFormCategoryId(cat.id); setSubEditTarget(undefined); setSubFormOpen(true) }}
                      >
                        {t('subcategories.add')}
                      </Button>
                    </Box>
                    {catSubs.length === 0 ? (
                      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', py: 1 }}>
                        {t('subcategories.empty')}
                      </Typography>
                    ) : (
                      <List dense disablePadding>
                        {catSubs.map((sub) => (
                          <ListItem key={sub.id} disableGutters>
                            <ListItemText primary={<Typography variant="body2">{sub.name}</Typography>} />
                            <ListItemSecondaryAction>
                              <IconButton size="small" onClick={() => { setSubEditTarget(sub); setSubFormOpen(true) }}>
                                <EditIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                              <IconButton size="small" color="error" onClick={() => setSubDeleteTarget(sub)}>
                                <DeleteIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>
                </Collapse>
              </Card>
            </Grid>
          )
        })}
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

      <SubCategoryForm
        open={subFormOpen}
        onClose={() => { setSubFormOpen(false); setSubEditTarget(undefined); setSubFormCategoryId(undefined) }}
        onSubmit={handleSubSubmit}
        initialData={subEditTarget}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title={t('categories.deleteTitle')}
        message={deleteTarget ? t('categories.deleteMessage', { name: deleteTarget.name }) : ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(undefined)}
      />

      <ConfirmDialog
        open={!!subDeleteTarget}
        title={t('subcategories.deleteTitle')}
        message={subDeleteTarget ? t('subcategories.deleteMessage', { name: subDeleteTarget.name }) : ''}
        onConfirm={handleSubDelete}
        onCancel={() => setSubDeleteTarget(undefined)}
      />
    </Box>
  )
}
