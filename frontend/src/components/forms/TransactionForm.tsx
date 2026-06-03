import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, FormHelperText, Stack, Box,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { transactionSchema, type TransactionFormData } from '@/schemas/transactionSchema'
import { useCategoryStore } from '@/stores/categoryStore'
import { subCategoryService } from '@/services/subCategoryService'
import type { Transaction } from '@/types/transaction'
import type { SubCategory } from '@/types/category'
import { ICON_MAP } from '@/utils/iconMap'
import dayjs from 'dayjs'

const LAST_DATE_KEY = 'lastTransactionDate'
const getInitialDate = () => localStorage.getItem(LAST_DATE_KEY) ?? dayjs().format('YYYY-MM-DD')

interface TransactionFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: TransactionFormData) => Promise<void>
  initialData?: Transaction
}

export function TransactionForm({ open, onClose, onSubmit, initialData }: TransactionFormProps) {
  const { categories, fetchCategories } = useCategoryStore()
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const { t } = useTranslation()

  const { control, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: undefined,
      type: 'EXPENSE',
      date: getInitialDate(),
      categoryId: undefined,
      subCategoryId: undefined,
      description: '',
    },
  })

  const selectedType = watch('type')
  const selectedCategoryId = watch('categoryId')

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
            subCategoryId: initialData.subCategoryId ?? undefined,
            description: initialData.description ?? '',
          }
        : {
            amount: undefined,
            type: 'EXPENSE',
            date: getInitialDate(),
            categoryId: undefined,
            subCategoryId: undefined,
            description: '',
          }
      )
      setSubCategories([])
    }
  }, [open, initialData, reset])

  useEffect(() => {
    if (!selectedCategoryId) {
      setSubCategories([])
      setValue('subCategoryId', undefined)
      return
    }
    subCategoryService.getAll(selectedCategoryId).then((subs) => {
      setSubCategories(subs)
      if (subs.length === 0) setValue('subCategoryId', undefined)
    })
  }, [selectedCategoryId, setValue])

  const filteredCategories = categories.filter((c) => c.type === selectedType)

  const handleFormSubmit = async (data: TransactionFormData) => {
    localStorage.setItem(LAST_DATE_KEY, data.date)
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
                  <MenuItem value="INVESTMENT">{t('forms.investment')}</MenuItem>
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
                <Select
                  {...field}
                  label={t('forms.category')}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value))
                    setValue('subCategoryId', undefined)
                  }}
                >
                  {filteredCategories.map((cat) => {
                    const IconComponent = ICON_MAP[cat.icon] ?? ICON_MAP['category']!
                    return (
                      <MenuItem key={cat.id} value={cat.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: cat.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <IconComponent sx={{ fontSize: 14, color: cat.color }} />
                        </Box>
                        {cat.name}
                      </MenuItem>
                    )
                  })}
                </Select>
                {errors.categoryId && <FormHelperText>{errors.categoryId.message}</FormHelperText>}
              </FormControl>
            )}
          />

          {subCategories.length > 0 && (
            <Controller
              name="subCategoryId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>{t('forms.subCategoryOptional')}</InputLabel>
                  <Select
                    {...field}
                    label={t('forms.subCategoryOptional')}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const v = e.target.value as string | number
                      field.onChange(v === '' ? undefined : Number(v))
                    }}
                  >
                    <MenuItem value="">{t('forms.subCategoryNone')}</MenuItem>
                    {subCategories.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          )}

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
