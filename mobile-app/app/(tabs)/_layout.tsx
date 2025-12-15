// app/(tabs)/_layout.tsx
import React, { useContext } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../../src/context/AuthContext";

export default function TabLayout() {
  const router = useRouter();
  const { token, loading } = useContext(AuthContext);

  const openProfile = () => {
    if (loading) return;

    if (!token) {
      router.push("/login");
    } else {
      // 🔥 IMPORTANT: push, NOT replace
      router.push("/profile");
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#22C55E",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          height: 64,
          paddingBottom: Platform.OS === "android" ? 6 : 8,
          backgroundColor: "#0a0f1a",
          borderTopWidth: 0,
        },
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />

      {/* EXPLORE */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <Ionicons name="paper-plane" size={24} color={color} />
          ),
        }}
      />

      {/* ADD EXPENSE */}
      <Tabs.Screen
        name="add-expense"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle" size={30} color={color} />
          ),
        }}
      />

      {/* PROFILE (DUMMY TAB) */}
      <Tabs.Screen
  name="dummy"
  options={{
    title: "Profile",

    tabBarButton: () => (
      <TouchableOpacity
        onPress={openProfile}
        activeOpacity={0.85}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name="person-circle-outline"
          size={26}
          color="#888"
        />
      </TouchableOpacity>
    ),
  }}
/>

    </Tabs>
  );
}
