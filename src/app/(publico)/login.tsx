import FormContainer from "@/src/components/ui/form-container";
import InputPadrao from "@/src/components/ui/input-padrao";
import LoadingModal from "@/src/components/ui/loading-modal";
import TextPadrao from "@/src/components/ui/text";

import { ROTAS } from "@/src/constants/routes";
import { useAuth } from "@/src/context/AuthContext";

import { login, logout } from "@/src/services/authService";
import { getUsuarioAtual } from "@/src/services/usuarioService";

import { toastError, toastSuccess } from "@/src/utils/toast";

import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();

  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (loading) return;

    if (!email.trim() || !password.trim()) {
      toastError("Preencha email e senha");
      return;
    }

    try {
      setLoading(true);

      await login(email.trim(), password);

      const usuario = await getUsuarioAtual();

      if (!usuario) {
        logout();
        toastError("Usuário não encontrado");
        return;
      }

      toastSuccess("Login realizado");

      if (usuario.tipo === "empresa") {
        setUser(usuario);
        router.replace(ROTAS.tabs.agendamentos);
      } else {
        logout();
        toastError("Usuário não encontrado ou usuario invalido!!!");
      }
    } catch (error: any) {
      console.log(error);

      toastError("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <FormContainer>
        <View style={styles.content}>
          <TextPadrao style={styles.title}>Bem-vindo 👋</TextPadrao>

          <TextPadrao style={styles.subtitle}>
            Entre para acessar seus agendamentos
          </TextPadrao>

          <InputPadrao
            placeholder="Seu email"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <InputPadrao
            placeholder="Sua senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <TextPadrao style={styles.buttonText}>
              {loading ? "Entrando..." : "Entrar"}
            </TextPadrao>
          </Pressable>

          <TextPadrao style={styles.registerText}>
            Ainda não tem conta?{" "}
            <TextPadrao
              style={styles.registerLink}
              onPress={() => router.push(ROTAS.publico.cadastro)}
            >
              Criar conta
            </TextPadrao>
          </TextPadrao>
        </View>
      </FormContainer>

      <LoadingModal visible={loading} />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    gap: 14,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  backText: {
    textAlign: "center",
    color: "#2563EB",
    marginTop: 8,
  },

  registerText: {
    marginTop: 15,
    textAlign: "center",
    color: "#666",
  },

  registerLink: {
    color: "#2563EB",
    fontWeight: "bold",
  },
});
