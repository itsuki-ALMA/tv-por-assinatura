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
  nome: string;
  valor: number;
}

interface Pacote {
  nome: string;
  servicosAdicionais: ServicoAdicional[];
  valor: number;
}

export default function PacotesPage() {
  const [nome, setNome] = useState('');
  const [servicos, setServicos] = useState<ServicoAdicional[]>([
    { nome: 'Instalação Rápida', valor: 29.99 },
    { nome: 'Suporte Premium', valor: 79.99 },
    { nome: 'Consultoria Técnica', valor: 49.99 },
    { nome: 'Atendimento Prioritário', valor: 59.99 },
  ]);
  const [selectedServicos, setSelectedServicos] = useState<ServicoAdicional[]>([]);
  const [selectedServico, setSelectedServico] = useState<ServicoAdicional | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [showDetails, setShowDetails] = useState<number | null>(null);

  const handleServicoChange = (e: SelectChangeEvent<string>) => {
    const servico = servicos.find(s => s.nome === e.target.value);
    if (servico) {
      setSelectedServico(servico);
    }
  };

  const handleAddServico = () => {
    if (!selectedServico) return;

    if (selectedServicos.some(s => s.nome === selectedServico.nome)) {
      setError('Este serviço já foi adicionado.');
      return;
    }

    setSelectedServicos([...selectedServicos, selectedServico]);
    setSelectedServico(null);
    setError('');
  };

  const handleDeleteServico = (servico: ServicoAdicional) => {
    setSelectedServicos(selectedServicos.filter(s => s !== servico));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nome || selectedServicos.length === 0) {
      setError('Nome e pelo menos um serviço adicional são obrigatórios.');
      return;
    }

    const pacoteValor = selectedServicos.reduce((acc, servico) => acc + servico.valor, 0);
    const novoPacote: Pacote = { nome, servicosAdicionais: selectedServicos, valor: pacoteValor };

    setPacotes([...pacotes, novoPacote]);
    setSuccess('Pacote cadastrado com sucesso!');
    setNome('');
    setSelectedServicos([]);
    setSelectedServico(null);
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
                value={selectedServico?.nome || ''}
                onChange={handleServicoChange}
                label="Escolha um Serviço Adicional"
              >
                {servicos.map((servico, index) => (
                  <MenuItem key={index} value={servico.nome}>
                    {servico.nome} - R$ {servico.valor.toFixed(2)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="outlined" color="secondary" onClick={handleAddServico} disabled={!selectedServico} sx={{
                borderColor: '#4e148c', // Tom de roxo mais escuro
                color: '#4e148c', // Texto roxo mais escuro
                '&:hover': {
                  backgroundColor: '#6a1b9a', // Cor de fundo ao passar o mouse
                  borderColor: '#4e148c', // Contorno ao passar o mouse
                  color: '#fff', // Cor do texto ao passar o mouse
                }
              }}>
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
                    <TableCell>{servico.nome}</TableCell>
                    <TableCell align="right">R$ {servico.valor.toFixed(2)}</TableCell>
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
            Total: R$ {selectedServicos.reduce((acc, servico) => acc + servico.valor, 0).toFixed(2)}
          </Typography>

          <Button type="submit" variant="contained" color="primary" size="large">
            Cadastrar Pacote
          </Button>
        </Box>
      </Paper>

      <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
        Pacotes Cadastrados:
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: '250px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nome do Pacote</strong></TableCell>
              <TableCell align="right"><strong>Valor Total</strong></TableCell>
              <TableCell align="right"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pacotes.map((pacote, index) => (
              <TableRow key={index}>
                <TableCell>{pacote.nome}</TableCell>
                <TableCell align="right">R$ {pacote.valor.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => setShowDetails(showDetails === index ? null : index)}>
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

      {showDetails !== null && (
        <Paper sx={{ padding: 3, marginTop: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Detalhes do Pacote: {pacotes[showDetails].nome}
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Serviço</strong></TableCell>
                <TableCell align="right"><strong>Valor</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pacotes[showDetails].servicosAdicionais.map((servico, index) => (
                <TableRow key={index}>
                  <TableCell>{servico.nome}</TableCell>
                  <TableCell align="right">R$ {servico.valor.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
