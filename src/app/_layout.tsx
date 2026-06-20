import { Stack } from "expo-router";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerTitle: "",
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="servicos/cadastro"
            options={{
              headerTitle: "Cadastro serviços",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="servicos/index"
            options={{
              headerTitle: "Servicos cadastrados",
              headerShown: true,
            }}
          />

          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(publico)"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="perfil/index"
            options={{
              headerShown: true,
              title: "Meu Perfil",
            }}
          />

          <Stack.Screen
            name="empresa/index"
            options={{
              headerShown: true,
              title: "Dados da Empresa",
            }}
          />
        </Stack>
      </AuthProvider>

      <Toast />
    </SafeAreaProvider>
  );
}
