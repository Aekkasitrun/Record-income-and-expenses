import { Box, Typography } from '@mui/material'
import Icon from '@mui/material/Icon'
import type { Category } from '@/types/category'

interface CategoryBadgeProps {
  category: Category
  showLabel?: boolean
}

export function CategoryBadge({ category, showLabel = true }: CategoryBadgeProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          backgroundColor: category.color + '22',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon sx={{ fontSize: 16, color: category.color }}>{category.icon}</Icon>
      </Box>
      {showLabel && (
        <Typography variant="body2" noWrap>
          {category.name}
        </Typography>
      )}
    </Box>
  )
}
