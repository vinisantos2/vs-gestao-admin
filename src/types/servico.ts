export type Servico = {
  id: string;
  imagem?: string;
  empresaId: string;
  nome: string;
  preco: number;
  duracao: number;
  ativo: boolean;
};

export type ServiceCreate = Omit<Servico, "id">;
