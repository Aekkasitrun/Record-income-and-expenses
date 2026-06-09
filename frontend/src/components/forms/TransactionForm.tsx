import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  FormControl, FormLabel, InputLabel, Select, MenuItem, FormHelperText,
  RadioGroup, Radio, FormControlLabel, Stack, Box, IconButton, Tooltip, Checkbox,
} from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
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
  prefillData?: Partial<TransactionFormData>
}

export function TransactionForm({ open, onClose, onSubmit, initialData, prefillData }: TransactionFormProps) {
  const { categories, fetchCategories, toggleFavourite } = useCategoryStore()
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [addAnother, setAddAnother] = useState(false)
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
      if (initialData) {
        reset({
          amount: initialData.amount,
          type: initialData.type,
          date: dayjs(initialData.date).format('YYYY-MM-DD'),
          categoryId: initialData.categoryId,
          subCategoryId: initialData.subCategoryId ?? undefined,
          description: initialData.description ?? '',
        })
      } else if (prefillData) {
        reset({
          amount: prefillData.amount ?? undefined,
          type: prefillData.type ?? 'EXPENSE',
          date: getInitialDate(),
          categoryId: prefillData.categoryId ?? undefined,
          subCategoryId: prefillData.subCategoryId ?? undefined,
          description: prefillData.description ?? '',
        })
      } else {
        reset({
          amount: undefined,
          type: 'EXPENSE',
          date: getInitialDate(),
          categoryId: undefined,
          subCategoryId: undefined,
          description: '',
        })
      }
      setSubCategories([])
    }
  }, [open, initialData, prefillData, reset])

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

  const filteredCategories = categories
    .filter((c) => c.type === selectedType)
    .sort((a, b) => {
      if (a.isFavourite === b.isFavourite) return a.name.localeCompare(b.name)
      return a.isFavourite ? -1 : 1
    })

  const handleFormSubmit = async (data: TransactionFormData) => {
    localStorage.setItem(LAST_DATE_KEY, data.date)
    await onSubmit({
      ...data,
      date: new Date(data.date).toISOString(),
      subCategoryId: data.subCategoryId ?? null,
    })
    if (addAnother) {
      reset({
        type: data.type,
        amount: data.amount,
        categoryId: data.categoryId,
        subCategoryId: data.subCategoryId,
        date: data.date,
        description: '',
      })
    } else {
      onClose()
    }
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
                <FormLabel>{t('forms.type')}</FormLabel>
                <RadioGroup {...field} row>
                  <FormControlLabel value="INCOME" control={<Radio />} label={t('forms.income')} />
                  <FormControlLabel value="EXPENSE" control={<Radio />} label={t('forms.expense')} />
                  <FormControlLabel value="INVESTMENT" control={<Radio />} label={t('forms.investment')} />
                </RadioGroup>
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
                    setSubCategories([])
                  }}
                >
                  {filteredCategories.map((cat) => {
                    const IconComponent = ICON_MAP[cat.icon] ?? ICON_MAP['category']!
                    return (
                      <MenuItem key={cat.id} value={cat.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 1 }}>
                        <Box sx={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: cat.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <IconComponent sx={{ fontSize: 14, color: cat.color }} />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>{cat.name}</Box>
                        <Tooltip title={cat.isFavourite ? t('categories.unfavourite') : t('categories.favourite')} arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); toggleFavourite(cat.id) }}
                            onMouseDown={(e) => e.stopPropagation()}
                            aria-label={cat.isFavourite ? t('categories.unfavourite') : t('categories.favourite')}
                            sx={{ flexShrink: 0 }}
                          >
                            {cat.isFavourite
                              ? <StarIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                              : <StarBorderIcon sx={{ fontSize: 18, color: 'text.disabled' }} />}
                          </IconButton>
                        </Tooltip>
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={t('forms.date')}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(val) => field.onChange(val ? val.format('YYYY-MM-DD') : '')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.date,
                      helperText: errors.date?.message,
                    },
                  }}
                />
              </LocalizationProvider>
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
      <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', px: 3, pb: 2 }}>
        {!initialData && (
          <FormControlLabel
            control={<Checkbox checked={addAnother} onChange={(e) => setAddAnother(e.target.checked)} size="small" />}
            label={t('forms.addAnother')}
            sx={{ ml: 0 }}
          />
        )}
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button onClick={onClose} disabled={isSubmitting}>{t('forms.cancel')}</Button>
          <Button onClick={handleSubmit(handleFormSubmit)} variant="contained" disabled={isSubmitting}>
            {isSubmitting ? t('forms.saving') : initialData ? t('forms.update') : t('forms.add')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
