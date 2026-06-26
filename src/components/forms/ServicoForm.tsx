import { ImagemSelecionavel } from "@/src/components/imagemSelecionavel";
import FormContainer from "@/src/components/ui/form-container";
import InputPadrao from "@/src/components/ui/input-padrao";
import { Servico } from "@/src/types/servico";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

type Props = {
  servico: Servico;
  imagemSelecionada: string;
  onChange: <K extends keyof Servico>(field: K, value: Servico[K]) => void;
  onSelecionarImagem: (uri: string) => void;
  onRemoverImagem: () => void;
  onSubmit: () => void;
  loading?: boolean;
  isEdicao?: boolean;
};

export function ServicoForm({
  servico,
  imagemSelecionada,
  onChange,
  onSelecionarImagem,
  onRemoverImagem,
  onSubmit,
  loading = false,
  isEdicao = false,
}: Props) {
  return (
    <FormContainer>
      {/* IMAGEM */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Imagem do serviço</Text>

        <ImagemSelecionavel
          imagem={imagemSelecionada || servico.imagem}
          largura={220}
          altura={180}
          circular={false}
          editavel
          textoBotao={
            imagemSelecionada || servico.imagem
              ? "Alterar imagem"
              : "Selecionar imagem"
          }
          onImagemSelecionada={onSelecionarImagem}
        />

        {imagemSelecionada || servico.imagem ? (
          <Pressable style={styles.removeImageButton} onPress={onRemoverImagem}>
            <Text style={styles.removeImageText}>Remover imagem</Text>
          </Pressable>
        ) : null}
      </View>

      {/* NOME */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Nome do serviço</Text>
        <InputPadrao
          placeholder="Ex: Corte masculino"
          value={servico.nome}
          onChangeText={(v) => onChange("nome", v)}
          style={styles.input}
        />
      </View>

      {/* DURAÇÃO E PREÇO */}
      <View style={styles.fieldRow}>
        <View style={[styles.fieldGroup, styles.fieldHalf]}>
          <Text style={styles.label}>Duração</Text>
          <InputPadrao
            placeholder="30"
            value={servico.duracao ? String(servico.duracao) : ""}
            onChangeText={(v) =>
              onChange("duracao", Number(v.replace(/\D/g, "")) || 0)
            }
            keyboardType="numeric"
            style={styles.input}
          />
          <Text style={styles.helperText}>Em minutos</Text>
        </View>

        <View style={[styles.fieldGroup, styles.fieldHalf]}>
          <Text style={styles.label}>Preço</Text>
          <InputPadrao
            tipo="moeda"
            placeholder="35,00"
            value={servico.preco}
            onChangeText={(v) => onChange("preco", v)}
            keyboardType="numeric"
            style={styles.input}
          />
          <Text style={styles.helperText}>Valor cobrado</Text>
        </View>
      </View>

      {/* SWITCH */}
      <View style={styles.statusCard}>
        <View style={styles.statusTextWrapper}>
          <Text style={styles.statusTitle}>Serviço disponível</Text>
          <Text style={styles.statusSubtitle}>
            Desative se não quiser que esse serviço apareça para novos
            agendamentos.
          </Text>
        </View>

        <Switch
          value={servico.ativo}
          onValueChange={(value) => onChange("ativo", value)}
          trackColor={{ false: "#d1d5db", true: "#93c5fd" }}
          thumbColor={servico.ativo ? "#2563EB" : "#f3f4f6"}
        />
      </View>

      {/* BOTÃO */}
      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading
            ? "Salvando..."
            : isEdicao
              ? "Atualizar serviço"
              : "Salvar serviço"}
        </Text>
      </Pressable>
    </FormContainer>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    marginBottom: 18,
  },

  fieldRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },

  fieldHalf: {
    flex: 1,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#f9fafb",
  },

  helperText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 6,
    lineHeight: 16,
  },

  removeImageButton: {
    marginTop: 10,
    alignSelf: "flex-start",
  },

  removeImageText: {
    color: "#dc2626",
    fontWeight: "600",
    fontSize: 13,
  },

  statusCard: {
    marginTop: 4,
    marginBottom: 20,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  statusTextWrapper: {
    flex: 1,
    paddingRight: 8,
  },

  statusTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  statusSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },

  button: {
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
