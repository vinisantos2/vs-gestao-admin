import type { Href } from "expo-router";
type Rota = Href;
export const ROTAS = {
  index: "/",

  publico: {
    login: "/(publico)/login" as Rota,
    cadastro: "/(publico)/register" as Rota,
    empresa: (idEmpresa: string) => ({
      pathname: "/(publico)/empresa" as Rota,
      params: { id: idEmpresa },
    }),
  },

  tabs: {
    agendamentos: "/(tabs)/agenda" as Rota,
    finaceiro: "/(tabs)/financeiro" as Rota,
    novoServico: "/(tabs)/servicos/cadastro" as Rota,
    menu: "/(tabs)/menu",
    editarAgendamento: (idAgendamento: string) => ({
      pathname: "/(admin)/agendamentos/cadastro" as Rota,
      params: { id: idAgendamento },
    }),
  },

  privado: {
    perfil: "/perfil" as Rota,
    empresa: "/empresa" as Rota,
    servicos: "/servicos" as Rota,
    novoServico: "/servicos/cadastro" as Rota,
    editarServico: (idServico: string) => ({
      pathname: "/servicos/cadastro" as Rota,
      params: { id: idServico },
    }),
  },
} as const;
