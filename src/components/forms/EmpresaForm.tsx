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
import InputPadrao from "../ui/input-padrao";

type Props = {
  empresa: Empresa;
  imagemSelecionada: string;
  onChange: <K extends keyof Empresa>(field: K, value: Empresa[K]) => void;
  onSelecionarImagem: (uri: string) => void;
  onRemoverImagem: () => void;
  onSelecionarLocalizacao: () => void;
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
  onSelecionarLocalizacao,
  onSubmit,
  loading = false,
  isEdicao = false,
}: Props) {
  return (
    <View style={styles.container}>
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

      {(imagemSelecionada || empresa.logoUrl) && (
        <Pressable style={styles.removeImageButton} onPress={onRemoverImagem}>
          <Text style={styles.removeImageText}>Remover imagem</Text>
        </Pressable>
      )}

      <View style={styles.form}>
        <Text style={styles.tituloSecao}>Informações</Text>

        <View>
          <Text style={styles.label}>Nome da empresa</Text>
          <InputPadrao
            value={empresa.nomeEmpresa}
            onChangeText={(text) => onChange("nomeEmpresa", text)}
            placeholder="Digite o nome da empresa"
          />
        </View>

        <View>
          <Text style={styles.label}>Telefone</Text>
          <InputPadrao
            value={empresa.telefone}
            onChangeText={(text) => onChange("telefone", text)}
            placeholder="Digite o telefone"
            keyboardType="phone-pad"
          />
        </View>

        <View>
          <Text style={styles.label}>Categoria</Text>
          <InputPadrao
            value={empresa.categoria ?? ""}
            onChangeText={(text) => onChange("categoria", text)}
            placeholder="Ex: Barbearia, Salão..."
          />
        </View>

        <View>
          <Text style={styles.label}>Descrição</Text>
          <InputPadrao
            value={empresa.descricao ?? ""}
            onChangeText={(text) => onChange("descricao", text)}
            placeholder="Fale um pouco sobre sua empresa"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            style={[styles.textArea]}
          />
        </View>
        <Text style={styles.tituloSecao}>Localização</Text>
        <View>
          <Text style={styles.label}>Endereço</Text>
          <InputPadrao
            value={empresa.endereco ?? ""}
            onChangeText={(text) => onChange("endereco", text)}
            placeholder="Digite o endereço"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Latitude</Text>
            <InputPadrao
              value={empresa.localizacao?.latitude?.toString() ?? ""}
              onChangeText={(text) =>
                onChange("localizacao", {
                  latitude: Number(text) || 0,
                  longitude: empresa.localizacao?.longitude ?? 0,
                })
              }
              keyboardType="numeric"
              placeholder="-10.123456"
            />
          </View>

          <View style={styles.col}>
            <Text style={styles.label}>Longitude</Text>
            <InputPadrao
              value={empresa.localizacao?.longitude?.toString() ?? ""}
              onChangeText={(text) =>
                onChange("localizacao", {
                  latitude: empresa.localizacao?.latitude ?? 0,
                  longitude: Number(text) || 0,
                })
              }
              keyboardType="numeric"
              placeholder="-38.123456"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.botaoLocalizacao}
          onPress={onSelecionarLocalizacao}
        >
          <Text style={styles.textoBotaoLocalizacao}>
            📍 Usar localização atual
          </Text>
        </TouchableOpacity>

        <Text style={styles.tituloSecao}>Funcionamento</Text>

        <View>
          <Text style={styles.label}>Horário de funcionamento</Text>
          <InputPadrao
            value={empresa.horario}
            onChangeText={(text) => onChange("horario", text)}
            placeholder="Ex: Seg a Sex - 08:00 às 18:00"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },

  titulo: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#111827",
  },

  tituloSecao: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563eb",
    marginTop: 24,
    marginBottom: 10,
  },

  form: {
    gap: 16,
    marginTop: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#374151",
  },

  textArea: {
    minHeight: 90,
    paddingTop: 12,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  col: {
    flex: 1,
  },

  botaoLocalizacao: {
    height: 52,
    borderWidth: 1,
    borderColor: "#2563eb",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },

  textoBotaoLocalizacao: {
    color: "#2563eb",
    fontWeight: "600",
    fontSize: 15,
  },

  botao: {
    height: 52,
    backgroundColor: "#2563eb",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 30,
  },

  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  botaoDisabled: {
    opacity: 0.7,
  },

  removeImageButton: {
    alignSelf: "center",
    marginTop: 12,
  },

  removeImageText: {
    color: "#dc2626",
    fontWeight: "600",
  },
});
