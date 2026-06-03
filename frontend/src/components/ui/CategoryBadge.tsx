import { Box, Typography } from '@mui/material'
import type { Category } from '@/types/category'
import { ICON_MAP } from '@/utils/iconMap'

interface CategoryBadgeProps {
  category: Category
  showLabel?: boolean
}

export function CategoryBadge({ category, showLabel = true }: CategoryBadgeProps) {
  const IconComponent = ICON_MAP[category.icon] ?? ICON_MAP['category']!
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
        <IconComponent sx={{ fontSize: 16, color: category.color }} />
      </Box>
      {showLabel && (
        <Typography variant="body2" noWrap>
          {category.name}
        </Typography>
      )}
    </Box>
  )
}
