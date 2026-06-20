import { ROTAS } from "@/src/constants/routes";
import { logout } from "@/src/services/authService";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, Text } from "react-native";

const menus = [
  {
    titulo: "Perfil Pessoal",
    icon: "person",
    rota: ROTAS.privado.perfil,
  },
  {
    titulo: "Dados da Empresa",
    icon: "business",
    rota: ROTAS.privado.empresa,
  },
  {
    titulo: "Novo Serviço",
    icon: "add-circle",
    rota: ROTAS.privado.novoServico,
  },
  {
    titulo: "Meus Serviços",
    icon: "list-alt",
    rota: "/servicos",
  },
  {
    titulo: "Agenda",
    icon: "event",
    rota: ROTAS.tabs.agendamentos,
  },
  {
    titulo: "Financeiro",
    icon: "attach-money",
    rota: ROTAS.tabs.finaceiro,
  },
  {
    titulo: "Avaliações",
    icon: "star",
    rota: "/avaliacoes",
  },
  {
    titulo: "Sair",
    icon: "logout",
    rota: ROTAS.publico.login,
  },
];

export default function Menu() {
  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Menu Principal
      </Text>

      {menus.map((item) => (
        <Pressable
          key={item.titulo}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            elevation: 2,
          }}
          onPress={() => {
            if (item.titulo === "Sair") {
              logout();
              router.replace(item.rota as any);
            } else {
              router.push(item.rota as any);
            }
          }}
        >
          <MaterialIcons name={item.icon as any} size={28} color="#2563eb" />

          <Text
            style={{
              marginLeft: 12,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {item.titulo}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
