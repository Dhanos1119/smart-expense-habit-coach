// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

/** token read helper (native + web fallback) */
async function readToken(): Promise<string | null> {
  try {
    const v = await SecureStore.getItemAsync("accessToken");
    if (v) return v;
  } catch {}
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem("accessToken");
    }
  } catch {}
  return null;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#22C55E",
        tabBarStyle: { height: 64, paddingBottom: 8 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} />
      <Tabs.Screen name="explore" options={{ title: "Explore", tabBarIcon: ({ color }) => <Ionicons name="paper-plane" size={24} color={color} /> }} />
      <Tabs.Screen name="add-expense" options={{ title: "Add", tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={28} color={color} /> }} />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={24} color={color} />,
          tabBarButton: (props: any) => {
            const onPress = async () => {
              const token = await readToken();
              const { router } = await import("expo-router");
              if (!token) router.push("/login");
              else router.push("/profile");
            };
            return (
              <TouchableOpacity {...(props as any)} activeOpacity={0.8} onPress={onPress} style={[props.style, Platform.OS === "android" ? { paddingVertical: 6 } : {}]} />
            );
          },
        }}
      />
    </Tabs>
  );
}
