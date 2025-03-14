// src/app/page.tsx
'use client';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Bem-vindo ao Sistema TV por Assinatura
      </Typography>
      <Button variant="contained" color="primary">
        Clique Aqui
      </Button>
    </main>
  );
}
