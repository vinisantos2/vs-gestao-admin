export type TipoMovimentacao = "entrada" | "saida";

export type OrigemMovimentacao =
  | "servico"
  | "produto"
  | "comanda"
  | "manual"
  | "despesa";

export type CategoriaFinanceira =
  | "venda_servico"
  | "venda_produto"
  | "comanda"
  | "despesa_fixa"
  | "fornecedor"
  | "salario"
  | "marketing"
  | "transporte"
  | "outros";

export interface MovimentacaoFinanceira {
  uid: string;
  tipo: TipoMovimentacao;
  origem: OrigemMovimentacao;
  categoria: CategoriaFinanceira;
  descricao: string;
  valor: number;
  data: string;
  clienteNome?: string;
  observacao?: string;
}

export type StatusConta = "pendente" | "pago" | "vencido" | "parcial";
export type TipoConta = "receber" | "pagar";

export interface ContaFinanceira {
  uid: string;
  tipo: TipoConta;
  status: StatusConta;
  descricao: string;
  valorTotal: number;
  vencimento: string;
  clienteNome?: string;
}

export interface ResumoFinanceiro {
  totalEntradas: number;
  totalSaidas: number;
  lucro: number;
  totalReceber: number;
  totalPagar: number;
}
