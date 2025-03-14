// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6C63FF', // Roxo principal
    },
    secondary: {
      main: '#D1CFFF', // Roxo claro
    },
    background: {
      default: '#F1F1F1', // Cinza claro
    },
    text: {
      primary: '#333333',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
