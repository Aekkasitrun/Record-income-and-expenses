import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, FormHelperText, Stack,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { categorySchema, type CategoryFormData } from '@/schemas/categorySchema'
import type { Category } from '@/types/category'

interface CategoryFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CategoryFormData) => Promise<void>
  initialData?: Category
}

const MUI_ICONS = ['category', 'work', 'laptop', 'trending_up', 'attach_money', 'restaurant', 'directions_car', 'shopping_cart', 'receipt', 'movie', 'favorite', 'school']

export function CategoryForm({ open, onClose, onSubmit, initialData }: CategoryFormProps) {
  const { t } = useTranslation()
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', type: 'EXPENSE', icon: 'category', color: '#003C71' },
  })

  useEffect(() => {
    if (open) {
      reset(initialData
        ? { name: initialData.name, type: initialData.type, icon: initialData.icon, color: initialData.color }
        : { name: '', type: 'EXPENSE', icon: 'category', color: '#003C71' }
      )
    }
  }, [open, initialData, reset])

  const handleFormSubmit = async (data: CategoryFormData) => {
    await onSubmit(data)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initialData ? t('forms.editCategory') : t('forms.addCategory')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField {...field} label={t('forms.name')} error={!!errors.name} helperText={errors.name?.message} />
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>{t('forms.type')}</InputLabel>
                <Select {...field} label={t('forms.type')}>
                  <MenuItem value="INCOME">{t('forms.income')}</MenuItem>
                  <MenuItem value="EXPENSE">{t('forms.expense')}</MenuItem>
                </Select>
                {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <Controller
            name="icon"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>{t('forms.icon')}</InputLabel>
                <Select {...field} label={t('forms.icon')}>
                  {MUI_ICONS.map((icon) => (
                    <MenuItem key={icon} value={icon}>{icon}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('forms.color')}
                type="color"
                error={!!errors.color}
                helperText={errors.color?.message}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>{t('forms.cancel')}</Button>
        <Button onClick={handleSubmit(handleFormSubmit)} variant="contained" disabled={isSubmitting}>
          {isSubmitting ? t('forms.saving') : initialData ? t('forms.update') : t('forms.add')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
