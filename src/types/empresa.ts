export interface Empresa {
  id?: string;
  nomeEmpresa: string;
  donoId: string;
  descricao?: string;
  telefone: string;
  endereco?: string;
  categoria?: string;
  logoUrl?: string;
  criadoEm?: Date;
  aberto: boolean;
  horario: string;
}
