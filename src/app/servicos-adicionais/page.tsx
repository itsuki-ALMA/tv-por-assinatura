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
  Alert
} from '@mui/material';

interface ServicoAdicional {
  nome: string;
  valor: number;
}

export default function ServicosAdicionaisPage() {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState<number | ''>('');
  const [servicos, setServicos] = useState<ServicoAdicional[]>([]);
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

    // Adicionar serviço à lista
    const novoServico = { nome, valor: Number(valor) };
    setServicos([...servicos, novoServico]);

    // Simulação de sucesso
    setSuccess('Serviço Adicional cadastrado com sucesso!');
    setNome('');
    setValor('');
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Cadastrar Serviço Adicional
      </Typography>

      <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <TextField
            label="Nome do Serviço"
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
            Cadastrar Serviço
          </Button>
        </Box>
      </Paper>

      {/* Tabela de Serviços Adicionais Cadastrados */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nome do Serviço</strong></TableCell>
              <TableCell align="right"><strong>Valor</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servicos.map((servico, index) => (
              <TableRow key={index}>
                <TableCell>{servico.nome}</TableCell>
                <TableCell align="right">{servico.valor.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
