export interface SnackbarState {
  open: boolean;
  message?: string;
}

export interface InputState {
  value?: string;
  error?: boolean;
  helperText?: string;
}
