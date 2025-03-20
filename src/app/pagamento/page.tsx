'use client';

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";  // Importando o jsPDF
import JsBarcode from "jsbarcode"; // Importando o JsBarcode para gerar o código de barras
import {
  Container,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";

interface Assinatura {
  id: number;
  user_id: number;
  pack_id: number | null;
  subscription_plan_id: number | null;
  total_value: string;
  created_at: string;
  user_name: string;  // Nome do cliente
  subscription_plan: {
    id: number;
    name: string;
    price: string;
  };
  additional_services: {
    id: number;
    name: string;
    price: string;
  }[];
}

interface Usuario {
  id: number;
  name: string | null;
  email: string;
  created_at: string;
  updated_at: string;
  age: number | null;
}

export default function AssinaturasListPage() {
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [detalhesAssinatura, setDetalhesAssinatura] = useState<Assinatura | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [sucessoMensagem, setSucessoMensagem] = useState<string>("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]); // Armazena todos os usuários
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Buscar todas as assinaturas
  useEffect(() => {
    fetch("http://localhost:5000/signatures")
      .then((res) => res.json())
      .then((data) => setAssinaturas(data))
      .catch((error) => console.error("Erro ao buscar assinaturas:", error));

    // Buscar todos os usuários
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Erro ao buscar usuários:", error));
  }, []);

  // Função para obter o nome do cliente com base no user_id
  const obterNomeCliente = (user_id: number): string => {
    const usuario = usuarios.find((user) => user.id === user_id);
    return usuario ? usuario.name || "Nome não disponível" : "Nome não encontrado";
  };

  // Função para abrir o modal com os detalhes da assinatura
  const abrirDetalhes = (assinatura: Assinatura) => {
    const nomeCliente = obterNomeCliente(assinatura.user_id);
    setDetalhesAssinatura({ ...assinatura, user_name: nomeCliente }); // Atualiza o nome do cliente na assinatura
    setOpenDialog(true);
  };

  // Função para fechar o modal
  const fecharDialog = () => {
    setOpenDialog(false);
    setDetalhesAssinatura(null);
  };

  // Função para gerar PDF do boleto
  const gerarBoletoPDF = () => {
    if (!detalhesAssinatura) return;

    const dataCriacao = new Date(detalhesAssinatura.created_at);
    const mesSubsequente = new Date(dataCriacao);
    mesSubsequente.setMonth(dataCriacao.getMonth() + 1); // Avança para o próximo mês

    const vencimentoBoleto = new Date(mesSubsequente.getFullYear(), mesSubsequente.getMonth(), 1); // Primeiro dia do mês subsequente
    const valorBoleto = parseFloat(detalhesAssinatura.total_value);

    // Criar o documento PDF
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Boleto de Pagamento", 10, 20);

    // Detalhes do Boleto
    doc.setFontSize(12);
    doc.text(`Cliente: ${detalhesAssinatura.user_name}`, 10, 30);  // Nome do cliente
    doc.text(`Plano: ${detalhesAssinatura.subscription_plan?.name || "Sem plano"}`, 10, 40);
    doc.text(`Valor: R$ ${valorBoleto.toFixed(2)}`, 10, 50);
    doc.text(`Data de Vencimento: ${vencimentoBoleto.toLocaleDateString()}`, 10, 60);

    // Gerando o código de barras usando o JsBarcode
    const barcodeCanvas = document.createElement('canvas');
    JsBarcode(barcodeCanvas, `Boleto-${detalhesAssinatura.id}`, {
      format: 'CODE128', // Tipo de código de barras
      displayValue: false, // Não exibe o valor no código de barras
    });

    // Convertendo o código de barras para imagem no formato Data URL
    const barcodeDataUrl = barcodeCanvas.toDataURL("image/png");

    // Inserir o código de barras no PDF
    doc.addImage(barcodeDataUrl, 'PNG', 10, 70, 180, 20); // Ajuste o tamanho conforme necessário

    // Gerar o PDF
    doc.save(`boleto_${detalhesAssinatura.id}.pdf`);
    setSucessoMensagem(`Boleto gerado com sucesso!`);
    setOpenSnackbar(true);
  };

  // Função para gerar PDF do carnê (12 parcelas)
  const gerarCarnePDF = () => {
    if (!detalhesAssinatura) return;

    const dataCriacao = new Date(detalhesAssinatura.created_at);
    const valorTotal = parseFloat(detalhesAssinatura.total_value);
    const valorParcela = valorTotal / 12; // Dividido por 12 para o parcelamento

    // Criar o documento PDF para o carnê
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Carnê de Pagamento", 10, 20);

    // Detalhes do cliente e plano
    doc.setFontSize(12);
    doc.text(`Cliente: ${detalhesAssinatura.user_name}`, 10, 30);  // Nome do cliente
    doc.text(`Plano: ${detalhesAssinatura.subscription_plan?.name || "Sem plano"}`, 10, 40);
    doc.text(`Valor Total: R$ ${valorTotal.toFixed(2)}`, 10, 50);

    let yPosition = 60; // Posição Y inicial
    for (let i = 1; i <= 12; i++) {
      const vencimentoCarne = new Date(dataCriacao);
      vencimentoCarne.setMonth(dataCriacao.getMonth() + i); // Avança um mês para cada parcela

      doc.setFontSize(12);
      doc.text(`Parcela ${i} - Vencimento: ${vencimentoCarne.toLocaleDateString()}`, 10, yPosition);
      doc.text(`Valor: R$ ${valorParcela.toFixed(2)}`, 10, yPosition + 10);

      yPosition += 20; // Ajusta a posição para a próxima parcela
    }

    // Gerar o PDF do carnê
    doc.save(`carne_${detalhesAssinatura.id}.pdf`);
    setSucessoMensagem(`Carnê gerado com sucesso!`);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lista de Assinaturas
      </Typography>

      <List>
        {assinaturas.map((assinatura) => (
          <ListItem component = "button" key={assinatura.user_name} onClick={() => abrirDetalhes(assinatura)}>
            <ListItemText
              primary={`Assinatura de ${assinatura.user_name} - R$ ${parseFloat(assinatura.total_value).toFixed(2)}`}
            />
          </ListItem>
        ))}
      </List>

      {/* Dialog de Detalhes da Assinatura */}
      <Dialog open={openDialog} onClose={fecharDialog}>
        <DialogTitle>Detalhes da Assinatura</DialogTitle>
        <DialogContent>
          {detalhesAssinatura && (
            <>
              <Typography variant="h6">Cliente: {detalhesAssinatura.user_name}</Typography> {/* Nome do cliente */}
              <Typography variant="subtitle1">Plano: {detalhesAssinatura.subscription_plan?.name || "Sem plano"}</Typography>
              <Typography variant="subtitle1">Preço do Plano: R$ {parseFloat(detalhesAssinatura.subscription_plan?.price || "0").toFixed(2)}</Typography>

              <Typography variant="subtitle1" style={{ marginTop: 10 }}>
                Serviços Adicionais:
              </Typography>
              {detalhesAssinatura.additional_services.map((servico) => (
                <Typography key={servico.id}>
                  {servico.name} - R$ {parseFloat(servico.price).toFixed(2)}
                </Typography>
              ))}

              <Typography variant="subtitle1" style={{ marginTop: 10 }}>
                Valor Total: R$ {parseFloat(detalhesAssinatura.total_value).toFixed(2)}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={gerarBoletoPDF} color="primary">Gerar Boleto</Button>
          <Button onClick={gerarCarnePDF} color="primary">Gerar Carnê</Button>
          <Button onClick={fecharDialog} color="primary">Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mostrar a mensagem de sucesso */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {sucessoMensagem}
        </Alert>
      </Snackbar>
    </Container>
  );
}
