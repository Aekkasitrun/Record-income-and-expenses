import { IconButton, Tooltip } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { useUiStore } from '@/stores/uiStore'

export function ThemeModeToggle() {
  const { themeMode, toggleThemeMode } = useUiStore()
  return (
    <Tooltip title={themeMode === 'dark' ? 'Light mode' : 'Dark mode'}>
      <IconButton color="inherit" onClick={toggleThemeMode} size="small">
        {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  )
}
