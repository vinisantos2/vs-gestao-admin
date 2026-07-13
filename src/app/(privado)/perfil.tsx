import { ImagemSelecionavel } from "@/src/components/imagemSelecionavel";
import FormContainer from "@/src/components/ui/form-container";
import { uploadImagem } from "@/src/services/uploadImagemService";
import {
  atualizarUsuario,
  getUsuarioAtual,
} from "@/src/services/usuarioService";
import { Usuario } from "@/src/types/usuario";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function Perfil() {
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [usuario, setUsuario] = useState<Usuario>({
    id: "",
    nome: "",
    imagem: "",
    email: "",
    telefone: "",
    tipo: "cliente",
  });

  // guarda a imagem escolhida localmente antes de salvar
  const [imagemSelecionada, setImagemSelecionada] = useState<string>("");

  async function carregarDados() {
    try {
      const data = await getUsuarioAtual();

      if (data) {
        setUsuario(data);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  }

  async function salvar() {
    try {
      setSalvando(true);

      let imagemUrl = usuario.imagem || "";

      // se escolheu uma imagem nova local, faz upload
      if (imagemSelecionada && !imagemSelecionada.startsWith("https")) {
        imagemUrl = await uploadImagem(
          imagemSelecionada,
          `usuarios/${usuario.id}/avatar`,
        );
      }

      await atualizarUsuario({
        ...usuario,
        imagem: imagemUrl,
      });

      setUsuario((prev) => ({
        ...prev,
        imagem: imagemUrl,
      }));

      setImagemSelecionada("");

      Alert.alert("Sucesso", "Perfil atualizado.");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Falha ao atualizar perfil.");
    } finally {
      setSalvando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Meu Perfil</Text>

      <ImagemSelecionavel
        imagem={imagemSelecionada || usuario.imagem}
        largura={120}
        altura={120}
        circular
        editavel
        textoBotao="Atualizar foto"
        onImagemSelecionada={(uri) => setImagemSelecionada(uri)}
      />

      <Text style={styles.label}>Nome</Text>
      <FormContainer>
        <TextInput
          style={styles.input}
          value={usuario.nome}
          onChangeText={(text) => setUsuario({ ...usuario, nome: text })}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          editable={false}
          value={usuario.email}
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={usuario.telefone}
          onChangeText={(text) => setUsuario({ ...usuario, telefone: text })}
        />

        <Text style={styles.label}>Tipo de Conta</Text>
        <TextInput style={styles.input} editable={false} value={usuario.tipo} />

        <TouchableOpacity
          style={[styles.botao, salvando && styles.botaoDisabled]}
          onPress={salvar}
          disabled={salvando}
        >
          <Text style={styles.botaoTexto}>
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </Text>
        </TouchableOpacity>
      </FormContainer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 4,
  },

  titulo: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: "#fff",
  },

  botao: {
    marginTop: 24,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },

  botaoDisabled: {
    opacity: 0.7,
  },

  botaoTexto: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
