import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Avaliacao = {
  id: string;
  cliente: string;
  nota: number;
  comentario: string;
  servico: string;
  data: string;
};

const AVALIACOES_MOCK: Avaliacao[] = [
  {
    id: "1",
    cliente: "João Silva",
    nota: 5,
    comentario: "Atendimento excelente, serviço rápido e muito bem feito.",
    servico: "Corte de cabelo",
    data: "20/06/2026",
  },
  {
    id: "2",
    cliente: "Maria Oliveira",
    nota: 4,
    comentario: "Gostei bastante, só achei o atendimento um pouco demorado.",
    servico: "Escova",
    data: "19/06/2026",
  },
  {
    id: "3",
    cliente: "Carlos Souza",
    nota: 3,
    comentario: "O serviço ficou bom, mas pode melhorar no prazo.",
    servico: "Barba",
    data: "18/06/2026",
  },
  {
    id: "4",
    cliente: "Ana Santos",
    nota: 5,
    comentario: "Perfeito, voltarei mais vezes com certeza.",
    servico: "Hidratação",
    data: "17/06/2026",
  },
  {
    id: "5",
    cliente: "Pedro Lima",
    nota: 2,
    comentario: "Não gostei muito do resultado final.",
    servico: "Pintura",
    data: "16/06/2026",
  },
];

const FILTROS = [
  { label: "Todas", value: 0 },
  { label: "5★", value: 5 },
  { label: "4★", value: 4 },
  { label: "3★", value: 3 },
  { label: "2★", value: 2 },
  { label: "1★", value: 1 },
];

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
      <View style={[styles.iconeResumo, { backgroundColor: cor + "20" }]}>
        <Ionicons name={icone} size={20} color={cor} />
      </View>

      <Text style={styles.cardResumoTitulo}>{titulo}</Text>
      <Text style={styles.cardResumoValor}>{valor}</Text>
    </View>
  );
}

function Estrelas({ nota }: { nota: number }) {
  return (
    <View style={styles.estrelasContainer}>
      {Array.from({ length: 5 }).map((_, index) => {
        const preenchida = index < nota;
        return (
          <Ionicons
            key={index}
            name={preenchida ? "star" : "star-outline"}
            size={16}
            color="#f59e0b"
            style={{ marginRight: 2 }}
          />
        );
      })}
    </View>
  );
}

export default function AvaliacoesScreen() {
  const [busca, setBusca] = useState("");
  const [filtroNota, setFiltroNota] = useState(0);

  const mediaAvaliacoes = useMemo(() => {
    if (AVALIACOES_MOCK.length === 0) return 0;
    const total = AVALIACOES_MOCK.reduce((acc, item) => acc + item.nota, 0);
    return total / AVALIACOES_MOCK.length;
  }, []);

  const totalCincoEstrelas = useMemo(() => {
    return AVALIACOES_MOCK.filter((item) => item.nota === 5).length;
  }, []);

  const avaliacoesFiltradas = useMemo(() => {
    return AVALIACOES_MOCK.filter((item) => {
      const matchBusca =
        item.cliente.toLowerCase().includes(busca.toLowerCase()) ||
        item.servico.toLowerCase().includes(busca.toLowerCase()) ||
        item.comentario.toLowerCase().includes(busca.toLowerCase());

      const matchNota = filtroNota === 0 ? true : item.nota === filtroNota;

      return matchBusca && matchNota;
    });
  }, [busca, filtroNota]);

  return (
    <View style={styles.container}>
      <FlatList
        data={avaliacoesFiltradas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listaContent}
        ListHeaderComponent={
          <>
            <Text style={styles.titulo}>Avaliações</Text>
            <Text style={styles.subtitulo}>
              Acompanhe a satisfação dos seus clientes
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.resumoContainer}
            >
              <CardResumo
                titulo="Média geral"
                valor={mediaAvaliacoes.toFixed(1)}
                icone="star"
                cor="#f59e0b"
              />
              <CardResumo
                titulo="Total"
                valor={String(AVALIACOES_MOCK.length)}
                icone="chatbubble-ellipses"
                cor="#2563eb"
              />
              <CardResumo
                titulo="5 estrelas"
                valor={String(totalCincoEstrelas)}
                icone="trophy"
                cor="#16a34a"
              />
            </ScrollView>

            <View style={styles.buscaContainer}>
              <Ionicons name="search" size={18} color="#6b7280" />
              <TextInput
                placeholder="Buscar cliente, serviço ou comentário..."
                placeholderTextColor="#9ca3af"
                style={styles.inputBusca}
                value={busca}
                onChangeText={setBusca}
              />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtrosContainer}
            >
              {FILTROS.map((filtro) => {
                const ativo = filtroNota === filtro.value;
                return (
                  <TouchableOpacity
                    key={filtro.value}
                    style={[styles.filtroBtn, ativo && styles.filtroBtnAtivo]}
                    onPress={() => setFiltroNota(filtro.value)}
                  >
                    <Text
                      style={[
                        styles.filtroTexto,
                        ativo && styles.filtroTextoAtivo,
                      ]}
                    >
                      {filtro.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.secaoTitulo}>
              {avaliacoesFiltradas.length} avaliação(ões)
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.cardAvaliacao}>
            <View style={styles.cardTopo}>
              <View style={{ flex: 1 }}>
                <Text style={styles.nomeCliente}>{item.cliente}</Text>
                <Text style={styles.nomeServico}>{item.servico}</Text>
              </View>

              <Text style={styles.data}>{item.data}</Text>
            </View>

            <Estrelas nota={item.nota} />

            <Text style={styles.comentario}>{item.comentario}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={40}
              color="#9ca3af"
            />
            <Text style={styles.emptyTitulo}>Nenhuma avaliação encontrada</Text>
            <Text style={styles.emptyTexto}>
              Tente buscar outro cliente ou alterar o filtro.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
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
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  iconeResumo: {
    width: 38,
    height: 38,
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
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  buscaContainer: {
    marginTop: 18,
    marginBottom: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 14,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  inputBusca: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
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
    marginTop: 12,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  cardAvaliacao: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  cardTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  nomeCliente: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  nomeServico: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },

  data: {
    fontSize: 12,
    color: "#9ca3af",
    marginLeft: 8,
  },

  estrelasContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },

  comentario: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
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
