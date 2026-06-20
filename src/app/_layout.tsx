import { Stack } from "expo-router";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
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
    </SafeAreaProvider>
  );
}
