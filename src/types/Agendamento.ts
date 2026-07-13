export type StatusAgendamento =
  | "agendado"
  | "esperando"
  | "atendimento"
  | "finalizado"
  | "cancelado"
  | "faltou";

export type Agendamento = {
  id?: string;

  empresaId: string;
  servicoId: string;

  data: string;

  inicio: string; // 🔥 "10:00"
  fim: string; // 🔥 "10:30"

  clienteNome?: string;
  clienteTelefone?: string;

  userId?: string;
  status?: StatusAgendamento;
};

export type AgendamentoCreate = Omit<Agendamento, "id">;
