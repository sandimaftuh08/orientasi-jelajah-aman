// app/(tabs)/_layout.tsx

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../contexts/theme-context";

export default function TabLayout() {
  const { colors } = useAppTheme();
  return (
    <Tabs screenOptions={{ headerShown: true, tabBarActiveTintColor: "#168a83", tabBarInactiveTintColor: colors.textSecondary, tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.backgroundSelected }, headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text }}>
      <Tabs.Screen
        name="index"
        options={{ title: "Beranda", tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} /> }}
      />

      <Tabs.Screen
        name="riwayat"
        options={{ title: "Favorit & Riwayat", tabBarIcon: ({ color, size }) => <Ionicons name="time" color={color} size={size} /> }}
      />

      <Tabs.Screen
        name="pengaturan"
        options={{ title: "Pengaturan", tabBarIcon: ({ color, size }) => <Ionicons name="settings-sharp" color={color} size={size} /> }}
      />

      <Tabs.Screen
        name="tentang"
        options={{ title: "Tentang", tabBarIcon: ({ color, size }) => <Ionicons name="information-circle" color={color} size={size} /> }}
      />
    </Tabs>
  );
}
