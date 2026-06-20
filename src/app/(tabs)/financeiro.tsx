import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ContaFinanceira,
  MovimentacaoFinanceira,
} from "@/src/types/financeiro";
import { CONTAS_MOCK, MOVIMENTACOES_MOCK } from "../mocks/financeiroMock";

const FILTROS = [
  { label: "Tudo", value: "todos" },
  { label: "Entradas", value: "entrada" },
  { label: "Saídas", value: "saida" },
];

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function CardResumo({
  titulo,
  valor,
  icone,
  cor,
}: {
  titulo: string;
  valor: string;
  icone: keyof typeof Ionicons.glyphMap;
  cor: string;
}) {
  return (
    <View style={styles.cardResumo}>
      <View style={[styles.iconeResumo, { backgroundColor: cor + "18" }]}>
        <Ionicons name={icone} size={20} color={cor} />
      </View>

      <Text style={styles.cardResumoTitulo}>{titulo}</Text>
      <Text style={styles.cardResumoValor}>{valor}</Text>
    </View>
  );
}

function BadgeStatus({ status }: { status: ContaFinanceira["status"] }) {
  const mapa = {
    pendente: { label: "Pendente", bg: "#fef3c7", color: "#92400e" },
    pago: { label: "Pago", bg: "#dcfce7", color: "#166534" },
    vencido: { label: "Vencido", bg: "#fee2e2", color: "#991b1b" },
    parcial: { label: "Parcial", bg: "#dbeafe", color: "#1d4ed8" },
  };

  const item = mapa[status];

  return (
    <View style={[styles.badge, { backgroundColor: item.bg }]}>
      <Text style={[styles.badgeText, { color: item.color }]}>
        {item.label}
      </Text>
    </View>
  );
}

function CardMovimentacao({ item }: { item: MovimentacaoFinanceira }) {
  const entrada = item.tipo === "entrada";

  return (
    <View style={styles.cardMovimentacao}>
      <View
        style={[
          styles.iconeMovimentacao,
          {
            backgroundColor: entrada ? "#dcfce7" : "#fee2e2",
          },
        ]}
      >
        <Ionicons
          name={entrada ? "arrow-down" : "arrow-up"}
          size={18}
          color={entrada ? "#15803d" : "#dc2626"}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.movimentacaoTitulo}>{item.descricao}</Text>
        <Text style={styles.movimentacaoSubtitulo}>
          {item.clienteNome ? `${item.clienteNome} • ${item.data}` : item.data}
        </Text>
      </View>

      <Text
        style={[
          styles.movimentacaoValor,
          { color: entrada ? "#16a34a" : "#dc2626" },
        ]}
      >
        {entrada ? "+" : "-"} {formatarMoeda(item.valor)}
      </Text>
    </View>
  );
}

function CardConta({ item }: { item: ContaFinanceira }) {
  return (
    <View style={styles.cardConta}>
      <View style={{ flex: 1 }}>
        <Text style={styles.contaTitulo}>{item.descricao}</Text>
        <Text style={styles.contaSubtitulo}>
          {item.clienteNome
            ? `${item.clienteNome} • vence em ${item.vencimento}`
            : `Vence em ${item.vencimento}`}
        </Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.contaValor}>{formatarMoeda(item.valorTotal)}</Text>
        <View style={{ marginTop: 8 }}>
          <BadgeStatus status={item.status} />
        </View>
      </View>
    </View>
  );
}

export default function FinanceiroScreen() {
  const [filtro, setFiltro] = useState<"todos" | "entrada" | "saida">("todos");

  const movimentacoesFiltradas = useMemo(() => {
    if (filtro === "todos") return MOVIMENTACOES_MOCK;
    return MOVIMENTACOES_MOCK.filter((item) => item.tipo === filtro);
  }, [filtro]);

  const resumo = useMemo(() => {
    const totalEntradas = MOVIMENTACOES_MOCK.filter(
      (item) => item.tipo === "entrada",
    ).reduce((acc, item) => acc + item.valor, 0);

    const totalSaidas = MOVIMENTACOES_MOCK.filter(
      (item) => item.tipo === "saida",
    ).reduce((acc, item) => acc + item.valor, 0);

    const totalReceber = CONTAS_MOCK.filter(
      (item) => item.tipo === "receber" && item.status !== "pago",
    ).reduce((acc, item) => acc + item.valorTotal, 0);

    const totalPagar = CONTAS_MOCK.filter(
      (item) => item.tipo === "pagar" && item.status !== "pago",
    ).reduce((acc, item) => acc + item.valorTotal, 0);

    return {
      totalEntradas,
      totalSaidas,
      lucro: totalEntradas - totalSaidas,
      totalReceber,
      totalPagar,
    };
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={movimentacoesFiltradas}
        keyExtractor={(item) => item.uid}
        contentContainerStyle={styles.listaContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={styles.titulo}>Financeiro</Text>
            <Text style={styles.subtitulo}>
              Controle entradas, saídas e contas pendentes
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.resumoContainer}
            >
              <CardResumo
                titulo="Entradas"
                valor={formatarMoeda(resumo.totalEntradas)}
                icone="trending-up"
                cor="#16a34a"
              />
              <CardResumo
                titulo="Saídas"
                valor={formatarMoeda(resumo.totalSaidas)}
                icone="trending-down"
                cor="#dc2626"
              />
              <CardResumo
                titulo="Lucro"
                valor={formatarMoeda(resumo.lucro)}
                icone="wallet"
                cor="#2563eb"
              />
              <CardResumo
                titulo="A receber"
                valor={formatarMoeda(resumo.totalReceber)}
                icone="cash"
                cor="#f59e0b"
              />
            </ScrollView>

            <View style={styles.acoesContainer}>
              <TouchableOpacity style={styles.botaoEntrada}>
                <Ionicons name="add-circle-outline" size={18} color="#fff" />
                <Text style={styles.botaoTexto}>Nova entrada</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botaoSaida}>
                <Ionicons name="remove-circle-outline" size={18} color="#fff" />
                <Text style={styles.botaoTexto}>Nova saída</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtrosContainer}
            >
              {FILTROS.map((item) => {
                const ativo = filtro === item.value;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[styles.filtroBtn, ativo && styles.filtroBtnAtivo]}
                    onPress={() => setFiltro(item.value as any)}
                  >
                    <Text
                      style={[
                        styles.filtroTexto,
                        ativo && styles.filtroTextoAtivo,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.secaoTitulo}>Movimentações</Text>
          </>
        }
        renderItem={({ item }) => <CardMovimentacao item={item} />}
        ListFooterComponent={
          <>
            <Text style={[styles.secaoTitulo, { marginTop: 20 }]}>
              Contas pendentes
            </Text>

            {CONTAS_MOCK.map((conta) => (
              <CardConta key={conta.uid} item={conta} />
            ))}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="wallet-outline" size={40} color="#9ca3af" />
            <Text style={styles.emptyTitulo}>Nenhuma movimentação</Text>
            <Text style={styles.emptyTexto}>
              Ainda não há dados financeiros para esse filtro.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  listaContent: {
    padding: 16,
    paddingBottom: 32,
  },

  titulo: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },

  subtitulo: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    marginBottom: 18,
  },

  resumoContainer: {
    paddingBottom: 8,
  },

  cardResumo: {
    width: 155,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  iconeResumo: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  cardResumoTitulo: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 4,
  },

  cardResumoValor: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  acoesContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    marginBottom: 16,
  },

  botaoEntrada: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#16a34a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  botaoSaida: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#dc2626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  botaoTexto: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  filtrosContainer: {
    paddingBottom: 8,
  },

  filtroBtn: {
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  filtroBtnAtivo: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },

  filtroTexto: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },

  filtroTextoAtivo: {
    color: "#fff",
  },

  secaoTitulo: {
    marginTop: 14,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  cardMovimentacao: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconeMovimentacao: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  movimentacaoTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  movimentacaoSubtitulo: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },

  movimentacaoValor: {
    fontSize: 15,
    fontWeight: "700",
  },

  cardConta: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  contaTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  contaSubtitulo: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },

  contaValor: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: "flex-start",
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },

  emptyTitulo: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  emptyTexto: {
    marginTop: 6,
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});
