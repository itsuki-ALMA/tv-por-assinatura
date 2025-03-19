'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';

export default function ClientesPage() {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState<number | ''>('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/users') // Substitua pelo seu endpoint real
      .then(response => response.json())
      .then(data => {
        setClientes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar clientes:', error);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nome || idade === '') {
      setError('Nome e idade são obrigatórios.');
      return;
    }

    if (Number(idade) < 18) {
      setError('Cliente precisa ser maior de idade (18+).');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: {
            name: nome,
            email: `${nome.toLowerCase()}@example.com`,
            age: idade
          }
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar cliente');
      }

      const newUser = await response.json();
      setClientes([...clientes, newUser]);
      setSuccess('Cliente cadastrado com sucesso!');
      setNome('');
      setIdade('');
    } catch (error) {
      setError('Erro ao cadastrar cliente');
      console.error(error);
    }
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

      <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
        Lista de Clientes
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {clientes.map(cliente => (
            <ListItem key={cliente.id}>
              <ListItemText primary={cliente.name || 'Nome não informado'} secondary={cliente.email} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}