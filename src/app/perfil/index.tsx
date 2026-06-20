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


import {
  atualizarUsuario,
  getUsuarioAtual,
} from "@/src/services/usuarioService";

import { AvatarUsuario } from "@/src/components/avatarUsuario";
import { Usuario } from "@/src/types/usuario";

export default function Perfil() {
  const [loading, setLoading] = useState(true);

  const [usuario, setUsuario] = useState<Usuario>({
    id: "",
    nome: "",
    imagem: "",
    email: "",
    telefone: "",
    tipo: "cliente",
  });

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
      await atualizarUsuario(usuario);

      Alert.alert("Sucesso", "Perfil atualizado.");
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar perfil.");
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
      <AvatarUsuario foto={usuario.imagem} tamanho={120} editavel />

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={usuario.nome}
        onChangeText={(text) => setUsuario({ ...usuario, nome: text })}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} editable={false} value={usuario.email} />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        value={usuario.telefone}
        onChangeText={(text) => setUsuario({ ...usuario, telefone: text })}
      />

      <Text style={styles.label}>Tipo de Conta</Text>
      <TextInput style={styles.input} editable={false} value={usuario.tipo} />

      <TouchableOpacity style={styles.botao} onPress={salvar}>
        <Text style={styles.botaoTexto}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
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

  botaoTexto: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
