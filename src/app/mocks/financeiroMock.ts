import {
    ContaFinanceira,
    MovimentacaoFinanceira,
} from "@/src/types/financeiro";

export const MOVIMENTACOES_MOCK: MovimentacaoFinanceira[] = [
  {
    uid: "1",
    tipo: "entrada",
    origem: "servico",
    categoria: "venda_servico",
    descricao: "Corte de cabelo",
    valor: 45,
    data: "20/06/2026",
    clienteNome: "João Silva",
  },
  {
    uid: "2",
    tipo: "entrada",
    origem: "comanda",
    categoria: "comanda",
    descricao: "Comanda mesa 04",
    valor: 120,
    data: "20/06/2026",
    clienteNome: "Maria Oliveira",
  },
  {
    uid: "3",
    tipo: "saida",
    origem: "despesa",
    categoria: "fornecedor",
    descricao: "Compra de produtos",
    valor: 80,
    data: "19/06/2026",
  },
  {
    uid: "4",
    tipo: "saida",
    origem: "manual",
    categoria: "transporte",
    descricao: "Combustível",
    valor: 50,
    data: "18/06/2026",
  },
  {
    uid: "5",
    tipo: "entrada",
    origem: "produto",
    categoria: "venda_produto",
    descricao: "Pomada modeladora",
    valor: 35,
    data: "18/06/2026",
    clienteNome: "Carlos Souza",
  },
];

export const CONTAS_MOCK: ContaFinanceira[] = [
  {
    uid: "1",
    tipo: "receber",
    status: "pendente",
    descricao: "Serviço de manutenção",
    valorTotal: 150,
    vencimento: "22/06/2026",
    clienteNome: "Pedro Lima",
  },
  {
    uid: "2",
    tipo: "pagar",
    status: "pendente",
    descricao: "Internet do estabelecimento",
    valorTotal: 100,
    vencimento: "25/06/2026",
  },
  {
    uid: "3",
    tipo: "pagar",
    status: "vencido",
    descricao: "Fornecedor de produtos",
    valorTotal: 220,
    vencimento: "15/06/2026",
  },
];
