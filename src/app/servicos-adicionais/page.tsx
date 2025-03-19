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

interface ServicoAdicional {
  id: number;
  name: string;
  price: string;
  created_at: string;
  updated_at: string;
}

export default function ServicosAdicionaisPage() {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState<number | ''>('');
  const [servicos, setServicos] = useState<ServicoAdicional[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estado para garantir que o código só é executado no cliente
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Garantir que estamos no cliente
    setIsClient(true);

    // Carregar serviços adicionais via GET
    fetch('http://localhost:5000/additional_services')
      .then((response) => response.json())
      .then((data) => setServicos(data))
      .catch((error) => console.error('Erro ao carregar os serviços adicionais', error));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validações
    if (!nome || valor === '') {
      setError('Nome e valor são obrigatórios.');
      return;
    }

    // Adicionar serviço via POST
    const novoServico = { 
      additional_service: { 
        name: nome, 
        price: valor 
      } 
    };

    fetch('http://localhost:5000/additional_services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoServico),
    })
      .then((response) => response.json())
      .then((data) => {
        setServicos((prevServicos) => [...prevServicos, data]); // Adiciona o novo serviço à lista
        setSuccess('Serviço Adicional cadastrado com sucesso!');
        setNome('');
        setValor('');
      })
      .catch((error) => {
        setError('Erro ao cadastrar o serviço adicional.');
        console.error('Erro ao cadastrar serviço adicional', error);
      });
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
            {servicos.map((servico) => (
              <TableRow key={servico.id}>
                <TableCell>{servico.name}</TableCell>
                <TableCell align="right">{parseFloat(servico.price).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
