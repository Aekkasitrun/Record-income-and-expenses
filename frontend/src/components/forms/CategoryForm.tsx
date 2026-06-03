import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, FormHelperText, Stack,
} from '@mui/material'
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
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', type: 'EXPENSE', icon: 'category', color: '#1976d2' },
  })

  useEffect(() => {
    if (open) {
      reset(initialData
        ? { name: initialData.name, type: initialData.type, icon: initialData.icon, color: initialData.color }
        : { name: '', type: 'EXPENSE', icon: 'category', color: '#1976d2' }
      )
    }
  }, [open, initialData, reset])

  const handleFormSubmit = async (data: CategoryFormData) => {
    await onSubmit(data)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initialData ? 'Edit Category' : 'Add Category'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Name" error={!!errors.name} helperText={errors.name?.message} />
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Type</InputLabel>
                <Select {...field} label="Type">
                  <MenuItem value="INCOME">Income</MenuItem>
                  <MenuItem value="EXPENSE">Expense</MenuItem>
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
                <InputLabel>Icon</InputLabel>
                <Select {...field} label="Icon">
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
                label="Color"
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
        <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        <Button onClick={handleSubmit(handleFormSubmit)} variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
