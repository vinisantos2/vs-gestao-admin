import FormContainer from "@/src/components/ui/form-container";
import InputPadrao from "@/src/components/ui/input-padrao";
import { ROTAS } from "@/src/constants/routes";
import { cadastrarParceiro } from "@/src/services/cadastroParceiroService";

import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text } from "react-native";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password) {
      Alert.alert("Atenção", "Preencha os campos obrigatórios");
      return;
    }

    try {
      setLoading(true);

      await cadastrarParceiro(name, email, password, company, telefone);

      Alert.alert("Sucesso", "Conta criada com sucesso!");
      router.replace(ROTAS.publico.login);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível cadastrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormContainer>
      <Text style={styles.title}>Criar Conta empresa</Text>

      <InputPadrao
        placeholder="Seu nome"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <InputPadrao
        placeholder="Nome da empresa"
        style={styles.input}
        value={company}
        onChangeText={setCompany}
      />

      <InputPadrao
        placeholder="Telefone"
        style={styles.input}
        value={telefone}
        tipo="telefone"
        onChangeText={setTelefone}
      />

      <InputPadrao
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        tipo="email"
        autoCapitalize="none"
      />

      <InputPadrao
        placeholder="Senha"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push(ROTAS.publico.login)}>
        <Text style={styles.link}>Já tenho conta</Text>
      </Pressable>
    </FormContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  buttonDisabled: {
    backgroundColor: "#93C5FD",
  },
  tipoContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },

  tipoButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
  },

  tipoAtivo: {
    backgroundColor: "#2563EB",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#2563EB",
  },
});
