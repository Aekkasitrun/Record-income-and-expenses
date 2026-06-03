import { create } from 'zustand'

type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning'

interface SnackbarState {
  open: boolean
  message: string
  severity: SnackbarSeverity
}

interface UiState {
  snackbar: SnackbarState
  themeMode: 'light' | 'dark'
  showSnackbar: (message: string, severity?: SnackbarSeverity) => void
  closeSnackbar: () => void
  toggleThemeMode: () => void
}

const savedTheme = (localStorage.getItem('themeMode') as 'light' | 'dark') ?? 'light'

export const useUiStore = create<UiState>()((set) => ({
  snackbar: { open: false, message: '', severity: 'info' },
  themeMode: savedTheme,

  showSnackbar: (message, severity = 'info') =>
    set({ snackbar: { open: true, message, severity } }),

  closeSnackbar: () =>
    set((state) => ({ snackbar: { ...state.snackbar, open: false } })),

  toggleThemeMode: () =>
    set((state) => {
      const next = state.themeMode === 'light' ? 'dark' : 'light'
      localStorage.setItem('themeMode', next)
      return { themeMode: next }
    }),
}))
