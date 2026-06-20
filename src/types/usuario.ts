export type Usuario = {
  id: string;
  imagem?: string;
  nome: string;
  email: string;
  tipo: "cliente" | "empresa";
  telefone?: string;
  empresaId?: string | null;
  criadoEm?: Date;
};
