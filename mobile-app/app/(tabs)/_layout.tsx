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

  const onProfilePress = () => {
    if (loading) return;

    if (!token) {
      router.replace("/login");
    } else {
      // 👇 IMPORTANT FIX: RANDOM KEY for forcing fresh mount
      const randomKey = Date.now().toString();
      router.push(`/profile?key=${randomKey}`);
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#22C55E",
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          backgroundColor: "#0a0f1a",
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <Ionicons name="paper-plane" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="add-expense"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle" size={30} color={color} />
          ),
        }}
      />

      {/* PROFILE TAB */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={26} color={color} />
          ),
          tabBarButton: (props: any) => (
            <TouchableOpacity
              {...props}
              activeOpacity={0.85}
              onPress={onProfilePress}
              style={[
                props.style,
                Platform.OS === "android" ? { paddingVertical: 6 } : {},
              ]}
            />
          ),
        }}
      />
    </Tabs>
  );
}
