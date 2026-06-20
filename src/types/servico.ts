export type Servico = {
  id: string;
  empresaId: string;
  nome: string;
  preco: string;
  duracao: number;
};

export type ServiceCreate = Omit<Servico, "id">;
