'use client';

import { useState, useEffect } from "react";
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function AssinaturasPage() {
  const [cliente, setCliente] = useState("");
  const [pacote, setPacote] = useState("");
  const [plano, setPlano] = useState("");
  const [servicosExtras, setServicosExtras] = useState<string[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [pacotes, setPacotes] = useState<any[]>([]);
  const [planos, setPlanos] = useState<any[]>([]);
  const [servicosAdicionais, setServicosAdicionais] = useState<any[]>([]);

  useEffect(() => {
    // Buscar clientes
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch((error) => console.error("Erro ao buscar clientes:", error));

    // Buscar planos
    fetch("http://localhost:5000/subscription_plans")
      .then((res) => res.json())
      .then((data) => setPlanos(data))
      .catch((error) => console.error("Erro ao buscar planos:", error));

    // Buscar pacotes
    fetch("http://localhost:5000/subscription_packs")
      .then((res) => res.json())
      .then((data) => setPacotes(data))
      .catch((error) => console.error("Erro ao buscar pacotes:", error));

    // Buscar serviços adicionais
    fetch("http://localhost:5000/additional_services")
      .then((res) => res.json())
      .then((data) => setServicosAdicionais(data))
      .catch((error) => console.error("Erro ao buscar serviços adicionais:", error));
  }, []);

  const pacoteSelecionado = pacotes.find((p) => p.name === pacote);
  const servicosNoPacote = pacoteSelecionado ? pacoteSelecionado.additional_services.map((s: any) => s.name) : [];

  const handleServicoChange = (event: any) => {
    const { value } = event.target;
    const servicosFiltrados = value.filter((s: string) => !servicosNoPacote.includes(s));
    setServicosExtras(servicosFiltrados);
  };

  const limparSelecao = () => {
    setPlano("");
    setPacote("");
    setServicosExtras([]);
  };

  const confirmarAssinatura = () => {
    const signatureData: any = {
      signature: {
        user_id: clientes.find((c) => c.name === cliente)?.id, // ID do cliente
        service_ids: servicosExtras.map((s) => servicosAdicionais.find((sa) => sa.name === s)?.id),
        // Adiciona o pacote ou plano selecionado
        pack_id: pacote ? pacotes.find((p) => p.name === pacote)?.id : undefined,
        subscription_plan_id: plano ? planos.find((p) => p.name === plano)?.id : undefined,
      }
    };
  
    // Verifica se pack_id ou subscription_plan_id foi realmente definido antes de enviar a requisição
    if (!signatureData.signature.pack_id && !signatureData.signature.subscription_plan_id) {
      console.error("Erro: Nenhum pacote ou plano selecionado.");
      return;
    }
  
    // Log para verificar o que está sendo enviado
    console.log("Dados enviados:", JSON.stringify(signatureData));
  
    // Fazer requisição POST
    fetch("http://localhost:5000/signatures", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signatureData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Assinatura realizada com sucesso:", data);
        // Resetar ou notificar o usuário
      })
      .catch((error) => {
        console.error("Erro ao realizar assinatura:", error);
      });
  };
  

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Assinatura de Cliente
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Selecione o Cliente</InputLabel>
        <Select value={cliente} onChange={(e) => setCliente(e.target.value)}>
          {clientes.map((c) => (
            <MenuItem key={c.id} value={c.name}>{c.name || c.email}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" disabled={!!pacote}>
        <InputLabel>Selecione o Plano</InputLabel>
        <Select value={plano} onChange={(e) => setPlano(e.target.value)}>
          {planos.map((p) => (
            <MenuItem key={p.id} value={p.name}>{p.name} - R$ {parseFloat(p.price).toFixed(2)}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" disabled={!!plano}>
        <InputLabel>Selecione o Pacote</InputLabel>
        <Select value={pacote} onChange={(e) => setPacote(e.target.value)}>
          {pacotes.map((p) => (
            <MenuItem key={p.id} value={p.name}>{p.name} - R$ {parseFloat(p.price).toFixed(2)}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {pacoteSelecionado && (
        <>
          <Typography variant="h6" gutterBottom>
            {pacoteSelecionado.description}
          </Typography>
          <Typography variant="subtitle1">Serviços Inclusos:</Typography>
          <List>
            {servicosNoPacote.map((s: string) => (
              <ListItem key={s}>
                <ListItemText primary={s} />
              </ListItem>
            ))}
          </List>
        </>
      )}

      <FormControl fullWidth margin="normal">
        <InputLabel>Serviços Extras</InputLabel>
        <Select multiple value={servicosExtras} onChange={handleServicoChange}>
          {servicosAdicionais
            .filter((s: any) => !servicosNoPacote.includes(s.name))
            .map((s: any) => (
              <MenuItem key={s.id} value={s.name}>{s.name}</MenuItem>
            ))}
        </Select>
      </FormControl>

      <Button variant="contained" color="secondary" fullWidth onClick={limparSelecao} style={{ marginBottom: 10 }}>
        Limpar Seleção
      </Button>

      <Button variant="contained" color="primary" fullWidth onClick={confirmarAssinatura}>
        Confirmar Assinatura
      </Button>
    </Container>
  );
}
