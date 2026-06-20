export const ROTAS = {
  index: "/",

  publico: {
    login: "/(publico)/login",
    cadastro: "/(publico)/register",
    empresa: (idEmpresa: string) => ({
      pathname: "/(publico)/empresa" as const,
      params: { id: idEmpresa },
    }),
  },
  tabs: {
    agendamentos: "/(tabs)/agenda",
    finaceiro: "/(tabs)/financeiro",
    comandas: "/(tabs)/comandas",
    novoServico: "/(tabs)/servicos/cadastro",
    menu: "/(tabs)/menu",
    editarAgendamento: (idAgendamento: string) => ({
      pathname: "/(admin)/agendamentos/cadastro" as const,
      params: { id: idAgendamento },
    }),
  },

  privado: {
    perfil: "/perfil",
    empresa: "/empresa",
    servicos: "/servicos",
    novoServico: "/servicos/cadastro",
    editarServico: (idServico: string) => ({
      pathname: "/servicos/cadastro" as const,
      params: { id: idServico },
    }),
  },
} as const;
