import { create } from 'zustand'

type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning'

interface SnackbarState {
  open: boolean
  message: string
  severity: SnackbarSeverity
}

interface UiState {
  snackbar: SnackbarState
  showSnackbar: (message: string, severity?: SnackbarSeverity) => void
  closeSnackbar: () => void
}

export const useUiStore = create<UiState>()((set) => ({
  snackbar: { open: false, message: '', severity: 'info' },

  showSnackbar: (message, severity = 'info') =>
    set({ snackbar: { open: true, message, severity } }),

  closeSnackbar: () =>
    set((state) => ({ snackbar: { ...state.snackbar, open: false } })),
}))
