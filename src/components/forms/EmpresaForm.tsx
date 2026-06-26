import { Empresa } from "@/src/types/empresa";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ImagemSelecionavel } from "../imagemSelecionavel";
import FormContainer from "../ui/form-container";
import InputPadrao from "../ui/input-padrao";

type Props = {
  empresa: Empresa;
  imagemSelecionada: string;
  onChange: <K extends keyof Empresa>(field: K, value: Empresa[K]) => void;
  onSelecionarImagem: (uri: string) => void;
  onRemoverImagem: () => void;
  onSubmit: () => void;
  loading?: boolean;
  isEdicao?: boolean;
};

export function EmpresaForm({
  empresa,
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
      <Text style={styles.titulo}>
        {isEdicao ? "Editar empresa" : "Dados da empresa"}
      </Text>

      <ImagemSelecionavel
        imagem={imagemSelecionada || empresa.logoUrl}
        largura={110}
        altura={110}
        circular={false}
        editavel
        textoBotao={
          imagemSelecionada || empresa.logoUrl
            ? "Alterar logo"
            : "Selecionar logo"
        }
        onImagemSelecionada={onSelecionarImagem}
      />

      {imagemSelecionada || empresa.logoUrl ? (
        <Pressable style={styles.removeImageButton} onPress={onRemoverImagem}>
          <Text style={styles.removeImageText}>Remover imagem</Text>
        </Pressable>
      ) : null}

      <View style={styles.form}>
        <View>
          <Text style={styles.label}>Nome da empresa</Text>
          <InputPadrao
            value={empresa.nomeEmpresa}
            onChangeText={(text) => onChange("nomeEmpresa", text)}
            placeholder="Digite o nome da empresa"
            style={styles.input}
          />
        </View>

        <View>
          <Text style={styles.label}>Telefone</Text>
          <InputPadrao
            value={empresa.telefone}
            onChangeText={(text) => onChange("telefone", text)}
            placeholder="Digite o telefone"
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <View>
          <Text style={styles.label}>Categoria</Text>
          <InputPadrao
            value={empresa.categoria ?? ""}
            onChangeText={(text) => onChange("categoria", text)}
            placeholder="Ex: Barbearia, Salão, Restaurante..."
            style={styles.input}
          />
        </View>

        <View>
          <Text style={styles.label}>Endereço</Text>
          <InputPadrao
            value={empresa.endereco ?? ""}
            onChangeText={(text) => onChange("endereco", text)}
            placeholder="Digite o endereço"
            style={styles.input}
          />
        </View>

        <View>
          <Text style={styles.label}>Horário</Text>
          <InputPadrao
            value={empresa.horario}
            onChangeText={(text) => onChange("horario", text)}
            placeholder="Ex: Seg a Sex - 08:00 às 18:00"
            style={styles.input}
          />
        </View>

        <View>
          <Text style={styles.label}>Descrição</Text>
          <InputPadrao
            value={empresa.descricao ?? ""}
            onChangeText={(text) => onChange("descricao", text)}
            placeholder="Fale um pouco sobre a empresa"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[styles.input, styles.textArea]}
          />
        </View>

        <TouchableOpacity
          style={[styles.botao, loading && styles.botaoDisabled]}
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>
              {isEdicao ? "Salvar alterações" : "Salvar empresa"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </FormContainer>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  textArea: {
    minHeight: 110,
  },
  botao: {
    backgroundColor: "#2563eb",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
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
  botaoDisabled: {
    opacity: 0.7,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
