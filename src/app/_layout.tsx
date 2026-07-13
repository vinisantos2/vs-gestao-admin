import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
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
              name="(publico)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(privado)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </AuthProvider>
      </PaperProvider>

      <Toast />
    </SafeAreaProvider>
  );
}
