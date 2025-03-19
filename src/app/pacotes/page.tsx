'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TablePagination,
} from '@mui/material';
import { Delete, Info } from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material';

interface ServicoAdicional {
  id: number;
  name: string;
  price: number;
}

interface Pacote {
  id: number;
  nome: string;
  servicosAdicionais: ServicoAdicional[];
  price: number;
}

export default function PacotesPage() {
  const [nome, setNome] = useState('');
  const [servicos, setServicos] = useState<ServicoAdicional[]>([]);
  const [selectedServicos, setSelectedServicos] = useState<ServicoAdicional[]>([]);
  const [selectedServico, setSelectedServico] = useState<ServicoAdicional | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [showDetails, setShowDetails] = useState<number | null>(null);

  // Fetch para obter serviços adicionais
  const fetchServicos = async () => {
    try {
      const response = await fetch('http://localhost:5000/additional_services');
      const data = await response.json();

      const servicosComPreco = data.map((servico: any) => {
        const preco = parseFloat(servico.price);
        return {
          id: servico.id,
          name: servico.name,
          price: !isNaN(preco) ? preco : 0,
        };
      });

      setServicos(servicosComPreco);
    } catch (error) {
      console.error('Erro ao buscar serviços adicionais:', error);
    }
  };

  // Fetch para obter pacotes existentes
  const fetchPacotes = async () => {
    try {
      const response = await fetch('http://localhost:5000/subscription_packs');
      const data = await response.json();

      const pacotesComServicos = data.map((pacote: any) => ({
        id: pacote.id,
        nome: pacote.name,
        price: parseFloat(pacote.price),
        servicosAdicionais: pacote.additional_services.map((servico: any) => ({
          id: servico.id,
          name: servico.name,
        })),
        valorTotal: pacote.additional_services.reduce((acc: number, servico: any) => acc + parseFloat(servico.price), 0),
      }));

      setPacotes(pacotesComServicos);
    } catch (error) {
      console.error('Erro ao buscar pacotes:', error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchServicos();
      fetchPacotes(); // Chama a função para carregar os pacotes
    }
  }, []);

  const handleServicoChange = (e: SelectChangeEvent<string>) => {
    const servico = servicos.find(s => s.name === e.target.value);
    if (servico) {
      setSelectedServico(servico);
    }
  };

  const handleAddServico = () => {
    if (!selectedServico) return;

    if (selectedServicos.some(s => s.name === selectedServico.name)) {
      setError('Este serviço já foi adicionado.');
      return;
    }

    setSelectedServicos([...selectedServicos, selectedServico]);
    setSelectedServico(null);
    setError('');
  };

  const handleDeleteServico = (servico: ServicoAdicional) => {
    setSelectedServicos(selectedServicos.filter(s => s.id !== servico.id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nome || selectedServicos.length === 0) {
      setError('Nome e pelo menos um serviço adicional são obrigatórios.');
      return;
    }

    const pacote = {
      subscription_pack: {
        name: nome,
        description: nome,
        price: selectedServicos.reduce((acc, servico) => acc + servico.price, 0),
      },
      service_ids: selectedServicos.map(servico => servico.id),
    };

    try {
      const response = await fetch('http://localhost:5000/subscription_packs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pacote),
      });

      if (response.ok) {
        setSuccess('Pacote cadastrado com sucesso!');
        fetchPacotes(); // Atualiza a lista de pacotes após o cadastro
      } else {
        const data = await response.json();
        setError(data.message || 'Erro ao cadastrar pacote.');
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      setError('Erro ao enviar dados.');
    }
  };

  const handleDeletePacote = (index: number) => {
    setPacotes(pacotes.filter((_, i) => i !== index));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleCloseAlert = () => {
    setError('');
    setSuccess('');
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Cadastrar Pacote
      </Typography>

      <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && (
            <Alert severity="error" onClose={handleCloseAlert}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" onClose={handleCloseAlert}>
              {success}
            </Alert>
          )}

          <TextField
            label="Nome do Pacote"
            variant="outlined"
            fullWidth
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="select-servico-label">Escolha um Serviço Adicional</InputLabel>
              <Select
                labelId="select-servico-label"
                value={selectedServico?.name || ''}
                onChange={handleServicoChange}
                label="Escolha um Serviço Adicional"
              >
                {servicos.map((servico, index) => (
                  <MenuItem key={index} value={servico.name}>
                    {servico.name} - R$ {servico.price.toFixed(2)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleAddServico}
              disabled={!selectedServico}
              sx={{
                borderColor: '#4e148c',
                color: '#4e148c',
                '&:hover': {
                  backgroundColor: '#6a1b9a',
                  borderColor: '#4e148c',
                  color: '#fff',
                },
              }}
            >
              Adicionar Serviço
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ maxHeight: '250px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Serviço</strong></TableCell>
                  <TableCell align="right"><strong>Valor</strong></TableCell>
                  <TableCell align="right"><strong>Ação</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedServicos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((servico, index) => (
                  <TableRow key={index}>
                    <TableCell>{servico.name}</TableCell>
                    <TableCell align="right">R$ {servico.price.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <IconButton color="error" onClick={() => handleDeleteServico(servico)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5]}
            component="div"
            count={selectedServicos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
          />

          <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'right' }}>
            Total: R$ {selectedServicos.reduce((acc, servico) => acc + servico.price, 0).toFixed(2)}
          </Typography>

          <Button type="submit" variant="contained" color="primary" size="large">
            Cadastrar Pacote
          </Button>
        </Box>
      </Paper>

      <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
        Pacotes Cadastrados:
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: '400px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nome do Pacote</strong></TableCell>
              <TableCell align="right"><strong>Valor Total</strong></TableCell>
              <TableCell align="right"><strong>Ação</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pacotes.map((pacote, index) => (
              <TableRow key={index}>
                <TableCell>{pacote.nome}</TableCell>
                <TableCell align="right">R$ {pacote.price.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => setShowDetails(pacote.id)}>
                    <Info />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeletePacote(index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
