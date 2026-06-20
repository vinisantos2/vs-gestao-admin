import { AvatarUsuario } from "@/src/components/avatarUsuario";
import { auth } from "@/src/firebase/config";
import { getEmpresaByUser, updateEmpresa } from "@/src/services/empresaService";
import { Empresa } from "@/src/types/empresa";
import { toastInfo } from "@/src/utils/toast";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const empresaInicial: Empresa = {
  nomeEmpresa: "",
  donoId: "",
  telefone: "",
  descricao: "",
  endereco: "",
  categoria: "",
  logoUrl: "",
};

export default function EmpresaScreen() {
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [empresa, setEmpresa] = useState<Empresa>(empresaInicial);

  useEffect(() => {
    carregarEmpresa();
  }, []);

  async function carregarEmpresa() {
    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const dados = await getEmpresaByUser(user.uid);

      if (dados) {
        setEmpresa({
          ...empresaInicial,
          ...dados,
          donoId: dados.donoId || user.uid,
        });
      } else {
        // se não existir empresa ainda, já monta uma base vazia
        setEmpresa({
          ...empresaInicial,
          donoId: user.uid,
        });
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar os dados da empresa.");
    } finally {
      setLoading(false);
    }
  }

  async function atualizarLogo(uri: string) {
    try {
      setEmpresa((prev) => ({
        ...prev,
        logoUrl: uri,
      }));
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível atualizar a logo.");
    }
  }

  async function salvarEmpresa() {
    try {
      if (!empresa.nomeEmpresa.trim()) {
        return Alert.alert("Atenção", "Informe o nome da empresa.");
      }

      if (!empresa.telefone.trim()) {
        return Alert.alert("Atenção", "Informe o telefone.");
      }

      const user = auth.currentUser;
      if (!user) {
        return Alert.alert("Erro", "Usuário não autenticado.");
      }

      setSalvando(true);

      const dadosParaSalvar: Empresa = {
        ...empresa,
        donoId: user.uid,
      };

      console.log("Salvar empresa:", dadosParaSalvar);
      const id = dadosParaSalvar.id;
      if (!id) {
        toastInfo("Erro empresa sem id:" + id);
        return;
      }

      updateEmpresa(id, dadosParaSalvar);

      // depois você liga aqui:
      // await saveEmpresa(dadosParaSalvar);

      Alert.alert("Sucesso", "Dados da empresa salvos com sucesso.");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.titulo}>Dados da Empresa</Text>

      <AvatarUsuario
        foto={empresa.logoUrl}
        tamanho={110}
        editavel
        onFotoSelecionada={atualizarLogo}
      />

      <View style={styles.form}>
        <View>
          <Text style={styles.label}>Nome da empresa</Text>
          <TextInput
            value={empresa.nomeEmpresa}
            onChangeText={(text) =>
              setEmpresa((prev) => ({ ...prev, nomeEmpresa: text }))
            }
            placeholder="Digite o nome da empresa"
            style={styles.input}
          />
        </View>

        <View>
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            value={empresa.telefone}
            onChangeText={(text) =>
              setEmpresa((prev) => ({ ...prev, telefone: text }))
            }
            placeholder="Digite o telefone"
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <View>
          <Text style={styles.label}>Categoria</Text>
          <TextInput
            value={empresa.categoria ?? ""}
            onChangeText={(text) =>
              setEmpresa((prev) => ({ ...prev, categoria: text }))
            }
            placeholder="Ex: Barbearia, Salão, Restaurante..."
            style={styles.input}
          />
        </View>

        <View>
          <Text style={styles.label}>Endereço</Text>
          <TextInput
            value={empresa.endereco ?? ""}
            onChangeText={(text) =>
              setEmpresa((prev) => ({ ...prev, endereco: text }))
            }
            placeholder="Digite o endereço"
            style={styles.input}
          />
        </View>

        <View>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            value={empresa.descricao ?? ""}
            onChangeText={(text) =>
              setEmpresa((prev) => ({ ...prev, descricao: text }))
            }
            placeholder="Fale um pouco sobre a empresa"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[styles.input, styles.textArea]}
          />
        </View>

        <TouchableOpacity
          style={styles.botao}
          onPress={salvarEmpresa}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>Salvar dados</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
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
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
