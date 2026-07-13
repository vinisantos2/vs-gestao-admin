import { ModalFila } from "@/src/components/modals/ModalFila";
import { useAuth } from "@/src/context/AuthContext";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useState } from "react";
import { FAB, Portal } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [modalFilaVisible, setModalFilaVisible] = useState(false);

  const [open, setOpen] = useState(false);

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: "#031b3e",
          tabBarInactiveTintColor: "#9ca3af",
          tabBarStyle: {
            height: 70 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 10,
            borderTopWidth: 1,
            elevation: 10,
          },
          headerTitleAlign: "center",
          headerTintColor: "#e4dbdb",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "700",
            letterSpacing: 0.3,
          },
          headerStyle: {
            backgroundColor: "#031b3e",
          },
        }}
      >
        <Tabs.Screen
          name="agenda"
          options={{
            title: "Agenda",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="financeiro"
          options={{
            title: "Caixa",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="cash-register" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="menu"
          options={{
            title: "Configurações",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="menu-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      <Portal>
        <FAB.Group
          open={open}
          visible
          icon={open ? "close" : "plus"}
          onStateChange={({ open }) => setOpen(open)}
          style={{
            paddingBottom: insets.bottom + 70,
          }}
          actions={[
            {
              icon: "account-plus",
              label: "Adicionar à fila",
              onPress: () => {
                setOpen(false);
                setModalFilaVisible(true);
              },
            },
            {
              icon: "content-cut",
              label: "Novo agendamento",
              onPress: () => {
                setOpen(false);
                console.log("Agendamento");
              },
            },
          ]}
        />
      </Portal>
      <ModalFila
        visible={modalFilaVisible}
        onDismiss={() => setModalFilaVisible(false)}
        onSubmit={(data) => {
          console.log(data);

          // Depois você chama o Firebase:
          // await criarFila(data);
        }}
      />
    </>
  );
}
