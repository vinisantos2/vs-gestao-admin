import AgendamentoCard from "@/src/components/ui/agendamentos/AgendamentoCard";
import CalendarPicker from "@/src/components/ui/calendar/calendar-picker";
import LoadingModal from "@/src/components/ui/loading-modal";
import TextPadrao from "@/src/components/ui/text";
import { ROTAS } from "@/src/constants/routes";

import { useEmpresAdmin } from "@/src/hooks/admin/useEmpresaAdmin";
import { getAgendamentosEmpresa } from "@/src/services/agendamentoService";
import { getServicos } from "@/src/services/empresaService";

import { Agendamento } from "@/src/types/Agendamento";
import { Servico } from "@/src/types/servico";

import { hojeBR } from "@/src/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

      try {
        setLoading(true);

        const dados = await getAgendamentosEmpresa(empresa.id);
        const servicosEmpresa = await getServicos(empresa.id);

        setServicos(servicosEmpresa);
        setTodosAgendamentos(dados);

        const hoje = hojeBR();
        setDataSelecionada(hoje);

        const filtrados = dados.filter((item) => item.data === hoje);
        setAgendamentos(filtrados);
      } catch (error) {
        console.log("Erro ao carregar agenda:", error);
      } finally {
        setLoading(false);
      }
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

  function handleSelecionarData(data: string) {
    setDataSelecionada(data);

    const filtrados = todosAgendamentos.filter((item) => item.data === data);
    setAgendamentos(filtrados);
  }

  const totalAgendamentos = agendamentos.length;

  const totalClientes = useMemo(() => {
    const nomes = new Set(
      agendamentos.map(
        (item) => item.clienteNome || item.clienteNome || item.clienteTelefone,
      ),
    );
    return nomes.size;
  }, [agendamentos]);

  const totalServicos = useMemo(() => {
    const ids = new Set(servicos.map((item) => item.id));
    return ids.size;
  }, [agendamentos]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Agenda</Text>
          <Text style={styles.description}>
            Gerencie os agendamentos da sua empresa por data.
          </Text>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* RESUMO */}
      <View style={styles.cardsRow}>
        <View style={styles.cardResumo}>
          <View style={[styles.iconBox, { backgroundColor: "#DBEAFE" }]}>
            <Ionicons name="calendar-outline" size={20} color="#2563EB" />
          </View>
          <Text style={styles.cardLabel}>Agendamentos</Text>
          <Text style={styles.cardValue}>{totalAgendamentos}</Text>
        </View>

        <View style={styles.cardResumo}>
          <View style={[styles.iconBox, { backgroundColor: "#DCFCE7" }]}>
            <Ionicons name="people-outline" size={20} color="#16A34A" />
          </View>
          <Text style={styles.cardLabel}>Clientes</Text>
          <Text style={styles.cardValue}>{totalClientes}</Text>
        </View>

        <View
          style={styles.cardResumo}
          onTouchStart={() => router.push(ROTAS.privado.servicos)}
        >
          <View style={[styles.iconBox, { backgroundColor: "#FEF3C7" }]}>
            <Ionicons name="cut-outline" size={20} color="#D97706" />
          </View>
          <Text style={styles.cardLabel}>Serviços</Text>
          <Text style={styles.cardValue}>{totalServicos}</Text>
        </View>
      </View>

      {/* CALENDÁRIO */}
      <View style={styles.calendarContainer}>
        <CalendarPicker
          dataSelecionada={dataSelecionada}
          onSelecionarData={handleSelecionarData}
        />
      </View>

      {/* INFO DA DATA */}
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

      {/* LISTA */}
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },

  description: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    maxWidth: 260,
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  cardsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  cardResumo: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  cardLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },

  cardValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
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
