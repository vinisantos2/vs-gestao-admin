import { Ionicons } from "@expo/vector-icons";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  aberto?: boolean;
  loading?: boolean;
  onToggle: () => void;
};

export default function EmpresaStatusCard({
  aberto = false,
  loading = false,
  onToggle,
}: Props) {
  return (
    <View
      style={[
        styles.container,
        aberto ? styles.containerAberto : styles.containerFechado,
      ]}
    >
      <View style={styles.top}>
        <View
          style={[
            styles.iconWrap,
            aberto ? styles.iconWrapAberto : styles.iconWrapFechado,
          ]}
        >
          <Ionicons
            name={aberto ? "checkmark-circle" : "close-circle"}
            size={28}
            color={aberto ? "#16A34A" : "#DC2626"}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            {aberto ? "Empresa aberta" : "Empresa fechada"}
          </Text>

          <Text style={styles.description}>
            {aberto
              ? "Sua empresa está disponível para atendimento no momento."
              : "Sua empresa está marcada como fechada no momento."}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          aberto ? styles.buttonFechar : styles.buttonAbrir,
          loading && styles.buttonDisabled,
        ]}
        onPress={onToggle}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons
              name={aberto ? "pause-circle-outline" : "play-circle-outline"}
              size={18}
              color="#fff"
            />
            <Text style={styles.buttonText}>
              {aberto ? "Fechar agora" : "Abrir agora"}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  containerAberto: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },

  containerFechado: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },

  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  iconWrapAberto: {
    backgroundColor: "#DCFCE7",
  },

  iconWrapFechado: {
    backgroundColor: "#FEE2E2",
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  description: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 21,
  },

  button: {
    marginTop: 16,
    height: 46,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  buttonAbrir: {
    backgroundColor: "#16A34A",
  },

  buttonFechar: {
    backgroundColor: "#DC2626",
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
