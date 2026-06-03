import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, FormHelperText, Stack,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { transactionSchema, type TransactionFormData } from '@/schemas/transactionSchema'
import { useCategoryStore } from '@/stores/categoryStore'
import type { Transaction } from '@/types/transaction'
import dayjs from 'dayjs'

interface TransactionFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: TransactionFormData) => Promise<void>
  initialData?: Transaction
}

export function TransactionForm({ open, onClose, onSubmit, initialData }: TransactionFormProps) {
  const { categories, fetchCategories } = useCategoryStore()
  const { t } = useTranslation()

  const { control, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: undefined,
      type: 'EXPENSE',
      date: dayjs().format('YYYY-MM-DD'),
      categoryId: undefined,
      description: '',
    },
  })

  const selectedType = watch('type')

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    if (open) {
      reset(initialData
        ? {
            amount: initialData.amount,
            type: initialData.type,
            date: dayjs(initialData.date).format('YYYY-MM-DD'),
            categoryId: initialData.categoryId,
            description: initialData.description ?? '',
          }
        : { amount: undefined, type: 'EXPENSE', date: dayjs().format('YYYY-MM-DD'), categoryId: undefined, description: '' }
      )
    }
  }, [open, initialData, reset])

  const filteredCategories = categories.filter((c) => c.type === selectedType)

  const handleFormSubmit = async (data: TransactionFormData) => {
    await onSubmit({
      ...data,
      date: new Date(data.date).toISOString(),
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? t('forms.editTransaction') : t('forms.addTransaction')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
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
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('forms.amount')}
                type="number"
                error={!!errors.amount}
                helperText={errors.amount?.message}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                slotProps={{ input: { inputProps: { min: 0, step: 0.01 } } }}
              />
            )}
          />

          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.categoryId}>
                <InputLabel>{t('forms.category')}</InputLabel>
                <Select {...field} label={t('forms.category')} value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                  {filteredCategories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
                {errors.categoryId && <FormHelperText>{errors.categoryId.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('forms.date')}
                type="date"
                error={!!errors.date}
                helperText={errors.date?.message}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('forms.description')}
                multiline
                rows={2}
                error={!!errors.description}
                helperText={errors.description?.message}
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
