import { Servico } from "@/src/types/servico";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ImagemSelecionavel } from "../../imagemSelecionavel";

type Props = {
  servico: Servico;
  onEditar: (servico: Servico) => void;
  onExcluir: (servico: Servico) => void;
};

export default function ServicoCard({ servico, onEditar, onExcluir }: Props) {
  return (
    <View style={styles.card}>
      {/* topo */}
      <View style={styles.header}>
        <View style={styles.leftContent}>
          <ImagemSelecionavel
            imagem={servico.imagem}
            largura={56}
            altura={56}
            circular
          />

          <View style={styles.infoContainer}>
            <Text style={styles.nome} numberOfLines={1}>
              {servico.nome}
            </Text>

            <View style={styles.metaRow}>
              <View style={styles.metaBadge}>
                <Feather name="clock" size={14} color="#4b5563" />
                <Text style={styles.metaText}>{servico.duracao} min</Text>
              </View>

              <View style={styles.metaBadge}>
                <Feather name="dollar-sign" size={14} color="#4b5563" />
                <Text style={styles.metaText}>
                  {servico.preco ? `R$ ${servico.preco}` : "R$ 0,00"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            servico.ativo ? styles.statusAtivo : styles.statusInativo,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              servico.ativo ? styles.statusTextAtivo : styles.statusTextInativo,
            ]}
          >
            {servico.ativo ? "Ativo" : "Inativo"}
          </Text>
        </View>
      </View>

      {/* ações */}
      <View style={styles.actions}>
        <Pressable
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEditar(servico)}
        >
          <Feather name="edit-2" size={16} color="#2563eb" />
          <Text style={[styles.actionText, styles.editText]}>Editar</Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onExcluir(servico)}
        >
          <Feather name="trash-2" size={16} color="#dc2626" />
          <Text style={[styles.actionText, styles.deleteText]}>Excluir</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#eef0f3",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },

  leftContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  infoContainer: {
    flex: 1,
  },

  nome: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },

  metaRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },

  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
  },

  metaText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusAtivo: {
    backgroundColor: "#dcfce7",
  },

  statusInativo: {
    backgroundColor: "#fee2e2",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  statusTextAtivo: {
    color: "#166534",
  },

  statusTextInativo: {
    color: "#991b1b",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  actionButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  editButton: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },

  deleteButton: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },

  actionText: {
    fontSize: 14,
    fontWeight: "700",
  },

  editText: {
    color: "#2563eb",
  },

  deleteText: {
    color: "#dc2626",
  },
});
