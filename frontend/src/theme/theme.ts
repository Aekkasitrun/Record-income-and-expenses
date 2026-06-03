import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    success: { main: '#2e7d32' },
    error: { main: '#d32f2f' },
    background: { default: '#f5f5f5' },
  },
  components: {
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: '1px solid #e0e0e0', borderRadius: 12 },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
    },
  },
})
