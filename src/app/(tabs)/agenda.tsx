import AgendamentoCard from "@/src/components/ui/agendamentos/AgendamentoCard";
import LoadingModal from "@/src/components/ui/loading-modal";

import { useEmpresAdmin } from "@/src/hooks/admin/useEmpresaAdmin";
import { getAgendamentosEmpresa } from "@/src/services/agendamentoService";
import { getServicos } from "@/src/services/empresaService";

import { Agendamento } from "@/src/types/Agendamento";
import { Servico } from "@/src/types/servico";

import { useIsFocused } from "@react-navigation/native";

import CalendarPicker from "@/src/components/ui/calendar/calendar-picker";
import TextPadrao from "@/src/components/ui/text";
import { useEffect, useState } from "react";

import { hojeBR } from "@/src/utils/date";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Agenda() {
  const { empresa } = useEmpresAdmin();
  const focused = useIsFocused();

  const [loading, setLoading] = useState(false);

  const [dataSelecionada, setDataSelecionada] = useState("");

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [todosAgendamentos, setTodosAgendamentos] = useState<Agendamento[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);

  useEffect(() => {
    async function carregar() {
      if (!empresa) return;

      setLoading(true);

      const dados = await getAgendamentosEmpresa(empresa.id);
      const servicosEmpresa = await getServicos(empresa.id);

      setServicos(servicosEmpresa);
      setTodosAgendamentos(dados);

      const hoje = hojeBR();

      setDataSelecionada(hoje);

      const filtrados = dados.filter((item) => item.data === hoje);

      setAgendamentos(filtrados);

      setLoading(false);
    }

    carregar();
  }, [empresa, focused]);

  function getNomeServico(id: string) {
    const servico = servicos.find((s) => s.id === id);
    return servico?.nome || "Serviço";
  }

  function handleEditar(id: string) {
    if (!id) return;

    // router.push(ROTAS.admin.editarAgendamento(id));
  }

  function handleDeletar(id: string) {
    console.log("deletar", id);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.calendarContainer}>
        <CalendarPicker
          dataSelecionada={dataSelecionada}
          onSelecionarData={(data) => {
            setDataSelecionada(data);

            const filtrados = todosAgendamentos.filter(
              (item) => item.data === data,
            );

            setAgendamentos(filtrados);
          }}
        />
      </View>

      <View style={styles.infoContainer}>
        <TextPadrao style={styles.subtitle}>
          Agendamentos de {dataSelecionada}
        </TextPadrao>
      </View>

      {agendamentos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Nenhum agendamento</Text>

          <Text style={styles.emptyText}>
            Você não possui agendamentos nesta data.
          </Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {agendamentos.map((item) => (
            <AgendamentoCard
              key={item.id}
              agendamento={item}
              servicoNome={getNomeServico(item.servicoId)}
              onExcluir={() => handleDeletar(item.id!)}
              onEditar={() => handleEditar(item.id!)}
            />
          ))}
        </View>
      )}

      <LoadingModal visible={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F3F4F6",
    flexGrow: 1,
  },

  ocupacaoButton: {
    backgroundColor: "#111827",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },

  ocupacaoButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
  },

  description: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  badge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 14,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  infoContainer: {
    marginBottom: 14,
  },

  subtitle: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "600",
  },

  listContainer: {
    gap: 14,
  },

  emptyContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
});
