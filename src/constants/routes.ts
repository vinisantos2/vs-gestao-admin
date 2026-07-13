import type { Href } from "expo-router";
type Rota = Href;
export const ROTAS = {
  index: "/",

  publico: {
    login: "/(publico)/login" as Rota,
    cadastro: "/(publico)/register" as Rota,
  },

  tabs: {
    agendamentos: "/(tabs)/agenda" as Rota,
    finaceiro: "/(tabs)/financeiro" as Rota,
    novoServico: "/(tabs)/servicos/cadastro" as Rota,
    menu: "/(tabs)/menu",
  },

  privado: {
    perfil: "(privado)/perfil" as Rota,
    empresa: "(privado)/empresa" as Rota,
    servicos: "(privado)/servicos" as Rota,
    novoServico: "(privado)/servicos/cadastro" as Rota,
    editarServico: (idServico: string) => ({
      pathname: "(privado)/servicos/cadastro" as Rota,
      params: { id: idServico },
    }),
  },
} as const;
