import { Servico } from "@/src/types/servico";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  servico: Servico;
  onEditar: (servico: Servico) => void;
  onExcluir: (servico: Servico) => void;
};

export default function ServicoCard({ servico, onEditar, onExcluir }: Props) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.nome}>{servico.nome}</Text>

        <Text style={styles.info}>
          R$ {servico.preco} • {servico.duracao} min
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.button, styles.edit]}
          onPress={() => onEditar(servico)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.delete]}
          onPress={() => onExcluir(servico)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  nome: {
    fontSize: 16,
    fontWeight: "bold",
  },

  info: {
    marginTop: 4,
    color: "#666",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  edit: {
    backgroundColor: "#2e6cff",
  },

  delete: {
    backgroundColor: "#ff4d4d",
  },

  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
