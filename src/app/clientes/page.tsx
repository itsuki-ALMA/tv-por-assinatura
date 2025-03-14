'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper
} from '@mui/material';

export default function ClientesPage() {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState<number | ''>('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validações
    if (!nome || idade === '') {
      setError('Nome e idade são obrigatórios.');
      return;
    }

    if (Number(idade) < 18) {
      setError('Cliente precisa ser maior de idade (18+).');
      return;
    }

    // Simulação de sucesso
    setSuccess('Cliente cadastrado com sucesso!');
    console.log('Cliente:', { nome, idade });

    // Limpa o formulário
    setNome('');
    setIdade('');
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, margin: '32px auto', borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Cadastrar Cliente
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <TextField
          label="Nome"
          variant="outlined"
          fullWidth
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <TextField
          label="Idade"
          type="number"
          variant="outlined"
          fullWidth
          value={idade}
          onChange={(e) => setIdade(e.target.value === '' ? '' : Number(e.target.value))}
          required
          inputProps={{ min: 0 }}
        />

        <Button type="submit" variant="contained" color="primary" size="large">
          Cadastrar
        </Button>
      </Box>
    </Paper>
  );
}
