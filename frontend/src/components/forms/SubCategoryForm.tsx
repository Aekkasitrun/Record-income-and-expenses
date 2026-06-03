import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { subCategorySchema, type SubCategoryFormData } from '@/schemas/subCategorySchema'
import type { SubCategory } from '@/types/category'

interface SubCategoryFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: SubCategoryFormData) => Promise<void>
  initialData?: SubCategory
}

export function SubCategoryForm({ open, onClose, onSubmit, initialData }: SubCategoryFormProps) {
  const { t } = useTranslation()

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SubCategoryFormData>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: { name: '' },
  })

  useEffect(() => {
    if (open) {
      reset(initialData ? { name: initialData.name } : { name: '' })
    }
  }, [open, initialData, reset])

  const handleFormSubmit = async (data: SubCategoryFormData) => {
    await onSubmit(data)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {initialData ? t('subcategories.editSubCategory') : t('subcategories.addSubCategory')}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('forms.name')}
                error={!!errors.name}
                helperText={errors.name?.message}
                autoFocus
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
