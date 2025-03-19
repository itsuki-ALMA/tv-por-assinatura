'use client';

import { useState } from "react";
import { 
  Container, FormControl, InputLabel, MenuItem, Select, Button, Typography, List, ListItem, ListItemText 
} from "@mui/material";

export default function AssinaturasPage() {
  const [cliente, setCliente] = useState("");
  const [pacote, setPacote] = useState("");
  const [servicosExtras, setServicosExtras] = useState<string[]>([]);

  const clientes = ["Cliente 1", "Cliente 2", "Cliente 3"];
  const pacotes = [
    { nome: "Pacote Básico", descricao: "Descrição do Pacote Básico", servicos: ["Serviço A"] },
    { nome: "Pacote Premium", descricao: "Descrição do Pacote Premium", servicos: ["Serviço A", "Serviço B"] },
    { nome: "Pacote VIP", descricao: "Descrição do Pacote VIP", servicos: ["Serviço A", "Serviço B", "Serviço C"] }
  ];
  const servicos = ["Serviço A", "Serviço B", "Serviço C", "Serviço D"];

  const pacoteSelecionado = pacotes.find((p) => p.nome === pacote);
  const servicosNoPacote = pacoteSelecionado ? pacoteSelecionado.servicos : [];

  const handleServicoChange = (event: any) => {
    const { value } = event.target;
    const novosServicos = Array.isArray(value) ? value : [];
    
    // Filtra para não permitir a adição de serviços já inclusos no pacote
    setServicosExtras(novosServicos.filter((s: string) => !servicosNoPacote.includes(s)));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Assinatura de Cliente
      </Typography>
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Selecione o Cliente</InputLabel>
        <Select value={cliente} onChange={(e) => setCliente(e.target.value)}>
          {clientes.map((c: string) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Selecione o Pacote</InputLabel>
        <Select value={pacote} onChange={(e) => setPacote(e.target.value)}>
          {pacotes.map((p) => (
            <MenuItem key={p.nome} value={p.nome}>{p.nome}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {pacoteSelecionado && (
        <>
          <Typography variant="h6" gutterBottom>
            {pacoteSelecionado.descricao}
          </Typography>
          <Typography variant="subtitle1">Serviços Inclusos:</Typography>
          <List>
            {pacoteSelecionado.servicos.map((s: string) => (
              <ListItem key={s}>
                <ListItemText primary={s} />
              </ListItem>
            ))}
          </List>
        </>
      )}
      
      <FormControl fullWidth margin="normal" disabled={!pacote}>
        <InputLabel>Serviços Extras</InputLabel>
        <Select
          multiple
          value={servicosExtras}
          onChange={handleServicoChange}
        >
          {servicos
            .filter((s: string) => !servicosNoPacote.includes(s))
            .map((s: string) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
        </Select>
      </FormControl>
      
      <Button variant="contained" color="primary" fullWidth>
        Confirmar Assinatura
      </Button>
    </Container>
  );
};
