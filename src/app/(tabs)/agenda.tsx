import EmpresaStatusCard from "@/src/components/EmpresaStatusCard";
import AgendamentoCard from "@/src/components/ui/agendamentos/AgendamentoCard";
import CalendarPicker from "@/src/components/ui/calendar/calendar-picker";
import LoadingModal from "@/src/components/ui/loading-modal";
import TextPadrao from "@/src/components/ui/text";
import { useEmpresAdmin } from "@/src/hooks/admin/useEmpresaAdmin";
import { getAgendamentosEmpresa } from "@/src/services/agendamentoService";
import { getServicos, updateEmpresa } from "@/src/services/empresaService";
import { Agendamento } from "@/src/types/Agendamento";
import { Servico } from "@/src/types/servico";
import { hojeBR } from "@/src/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Agenda() {
  const { empresa, setEmpresa } = useEmpresAdmin();
  const focused = useIsFocused();

  const [loading, setLoading] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [todosAgendamentos, setTodosAgendamentos] = useState<Agendamento[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);

  useEffect(() => {
    async function carregar() {
      if (!empresa?.id) return;

      try {
        setLoading(true);

        const [dados, servicosEmpresa] = await Promise.all([
          getAgendamentosEmpresa(empresa.id),
          getServicos(empresa.id),
        ]);

        setServicos(servicosEmpresa);
        setTodosAgendamentos(dados);

        const hoje = hojeBR();
        setDataSelecionada(hoje);
        setAgendamentos(dados.filter((item) => item.data === hoje));
      } catch (error) {
        console.log("Erro ao carregar agenda:", error);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [empresa?.id, focused]);

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

  function handleSelecionarData(data: string) {
    setDataSelecionada(data);
    setAgendamentos(todosAgendamentos.filter((item) => item.data === data));
  }

  async function handleToggleEmpresa() {
    if (!empresa?.id) return;

    try {
      setLoading(true);

      const novoStatus = !empresa.aberto;

      await updateEmpresa(empresa.id, {
        aberto: novoStatus,
      });

      setEmpresa((prev) =>
        prev
          ? {
              ...prev,
              aberto: novoStatus,
            }
          : prev,
      );
    } catch (error) {
      console.log("Erro ao atualizar status da empresa:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <EmpresaStatusCard
        aberto={empresa?.aberto}
        loading={loading}
        onToggle={handleToggleEmpresa}
      />

      <View style={styles.calendarContainer}>
        <CalendarPicker
          dataSelecionada={dataSelecionada}
          onSelecionarData={handleSelecionarData}
        />
      </View>

      <View style={styles.infoContainer}>
        <TextPadrao style={styles.subtitle}>
          Agendamentos de {dataSelecionada}
        </TextPadrao>

        <Text style={styles.infoText}>
          {agendamentos.length === 0
            ? "Nenhum horário reservado nesta data."
            : `${agendamentos.length} agendamento(s) encontrado(s).`}
        </Text>
      </View>

      {agendamentos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons name="calendar-clear-outline" size={30} color="#6B7280" />
          </View>

          <Text style={styles.emptyTitle}>Nenhum agendamento</Text>

          <Text style={styles.emptyText}>
            Você não possui agendamentos cadastrados nesta data.
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
    flexGrow: 1,
    backgroundColor: "#F3F4F6",
    padding: 16,
    paddingBottom: 32,
  },

  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  infoContainer: {
    marginBottom: 14,
  },

  subtitle: {
    fontSize: 17,
    color: "#111827",
    fontWeight: "700",
  },

  infoText: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
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
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
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
    maxWidth: 280,
  },
});
