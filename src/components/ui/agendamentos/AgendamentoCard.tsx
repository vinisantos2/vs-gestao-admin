import { Agendamento } from "@/src/types/Agendamento";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  agendamento: Agendamento;
  servicoNome?: string;
  onEditar: () => void;
  onExcluir: () => void;
};

export default function AgendamentoCard({
  agendamento,
  servicoNome,
  onEditar,
  onExcluir,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {/* 🔥 HORÁRIO AJUSTADO */}
        <Text style={styles.hora}>
          {agendamento.inicio} - {agendamento.fim}
        </Text>

        <Text style={styles.servico}>{servicoNome}</Text>
      </View>

      <Text style={styles.cliente}>{agendamento.clienteNome}</Text>
      <Text style={styles.telefone}>{agendamento.clienteTelefone}</Text>

      <View style={styles.actions}>
        <Pressable style={styles.editBtn} onPress={onEditar}>
          <Text style={styles.btnText}>Editar</Text>
        </Pressable>

        <Pressable style={styles.deleteBtn} onPress={onExcluir}>
          <Text style={styles.btnText}>Excluir</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  hora: {
    fontWeight: "bold",
    fontSize: 16,
  },

  servico: {
    color: "#555",
  },

  cliente: {
    fontSize: 16,
    marginTop: 4,
  },

  telefone: {
    color: "#777",
    fontSize: 13,
    marginTop: 2,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },

  editBtn: {
    flex: 1,
    backgroundColor: "#2e6cff",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },

  deleteBtn: {
    flex: 1,
    backgroundColor: "#ef4444",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
