'use client';

import { useState, useEffect } from 'react';
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

  // Função para buscar os planos da API
  const fetchPlanos = async () => {
    try {
      const response = await fetch('http://localhost:5000/subscription_plans');
      const data = await response.json();
      
      if (data.subscription_plans) {
        const planosFetched = data.subscription_plans.map((plano: any) => ({
          nome: plano.name,
          valor: parseFloat(plano.price)
        }));
        setPlanos(planosFetched);
      }
    } catch (error) {
      setError('Erro ao buscar planos.');
    }
  };

  useEffect(() => {
    fetchPlanos();
  }, []); // Carregar os planos assim que o componente for montado

  // Função para cadastrar um novo plano
  const handleCreatePlano = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nome || valor === '') {
      setError('Nome e valor são obrigatórios.');
      return;
    }

    const novoPlano = { subscription_plan: { name: nome, price: valor } };

    try {
      const response = await fetch('http://localhost:5000/subscription_plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoPlano)
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar plano.');
      }

      setSuccess('Plano cadastrado com sucesso!');
      setNome('');
      setValor('');

      // Atualizar lista de planos
      fetchPlanos();
    } catch (error) {
      setError('Erro ao cadastrar plano.');
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Cadastrar Plano
      </Typography>

      <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
        <Box component="form" onSubmit={handleCreatePlano} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                <TableCell align="right">R$ {plano.valor.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
