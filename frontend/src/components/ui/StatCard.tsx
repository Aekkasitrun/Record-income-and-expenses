import { Card, CardContent, Typography, Box } from '@mui/material'
import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: ReactNode
  color?: string
}

export function StatCard({ title, value, subtitle, icon, color = '#1976d2' }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color, opacity: 0.8, fontSize: 40 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  )
}
