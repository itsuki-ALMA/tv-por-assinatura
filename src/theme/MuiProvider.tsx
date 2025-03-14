// src/theme/MuiProvider.tsx
'use client';

import { ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';

export default function MuiProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
