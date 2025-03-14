'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert
} from '@mui/material';

interface Plano {
  nome: string;
  valor: number;
}

export default function PlanosPage() {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState<number | ''>('');
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validações
    if (!nome || valor === '') {
      setError('Nome e valor são obrigatórios.');
      return;
    }

    // Adicionar plano à lista
    const novoPlano = { nome, valor: Number(valor) };
    setPlanos([...planos, novoPlano]);

    // Simulação de sucesso
    setSuccess('Plano cadastrado com sucesso!');
    setNome('');
    setValor('');
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Cadastrar Plano
      </Typography>

      <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <TextField
            label="Nome do Plano"
            variant="outlined"
            fullWidth
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <TextField
            label="Valor"
            type="number"
            variant="outlined"
            fullWidth
            value={valor}
            onChange={(e) => setValor(e.target.value === '' ? '' : Number(e.target.value))}
            required
            inputProps={{ min: 0 }}
          />

          <Button type="submit" variant="contained" color="primary" size="large">
            Cadastrar Plano
          </Button>
        </Box>
      </Paper>

      {/* Tabela de Planos Cadastrados */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nome do Plano</strong></TableCell>
              <TableCell align="right"><strong>Valor</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {planos.map((plano, index) => (
              <TableRow key={index}>
                <TableCell>{plano.nome}</TableCell>
                <TableCell align="right">{plano.valor.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
