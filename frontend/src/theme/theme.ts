import { createTheme } from '@mui/material/styles'

export function createAppTheme(mode: 'light' | 'dark') {
  return createTheme({
    palette: {
      mode,
      primary: { main: mode === 'dark' ? '#009CDE' : '#003C71' },
      secondary: { main: mode === 'dark' ? '#003C71' : '#009CDE' },
      success: { main: '#2e7d32' },
      error: { main: '#d32f2f' },
      background: {
        default: mode === 'dark' ? '#0a1929' : '#FFFFFF',
        paper: mode === 'dark' ? '#132f4c' : '#FFFFFF',
      },
    },
    components: {
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: mode === 'dark' ? '1px solid #1e4976' : '1px solid #e0e0e0',
            borderRadius: 12,
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
      },
    },
  })
}
