export const ROTAS = {
  tabs: {
    agendamentos: "/(tabs)/agenda",
    caixa: "/(tabs)/caixa",
    comandas: "/(tabs)/comandas",
    novoServico: "/(tabs)/servicos/cadastro",
    editarAgendamento: (idAgendamento: string) => ({
      pathname: "/(admin)/agendamentos/cadastro" as const,
      params: { id: idAgendamento },
    }),
  },
  publico: {
    login: "/(publico)/login",
    cadastro: "/(publico)/register",
    empresa: (idEmpresa: string) => ({
      pathname: "/(publico)/empresa" as const,
      params: { id: idEmpresa },
    }),
  },
} as const;
