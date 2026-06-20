import { useAuth } from "@/src/context/AuthContext";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  if (!user) {
    return <Redirect href="/login" />;
  }
  return (
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
        name="caixa"
        options={{
          title: "Caixa",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="cash-register" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="comandas"
        options={{
          title: "Comandas",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="receipt-long" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="menu"
        options={{
          title: "Configuraçõe",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
