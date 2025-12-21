import React, { useContext } from "react";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Platform, Text } from "react-native";

import { AuthContext } from "../../src/context/AuthContext";
import { useTheme } from "../../src/context/ThemeContext";

export default function TabLayout() {
  const router = useRouter();
  const { token, loading } = useContext(AuthContext);
  const { colors } = useTheme();

  const openProfile = () => {
    if (loading) return;
    router.push(token ? "/profile" : "/login");
  };

  return (
    <Tabs
      key={colors.background} // 🔥 THIS IS THE MAGIC LINE
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subText,

        tabBarStyle: {
          height: 64,
          paddingBottom: Platform.OS === "android" ? 6 : 8,
          backgroundColor: colors.background,
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

      {/* PROFILE */}
      <Tabs.Screen
        name="dummy"
        options={{
          title: "Profile",
          tabBarButton: ({ accessibilityState }) => {
            const focused = accessibilityState?.selected;

            return (
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
                  name={focused ? "person" : "person-outline"}
                  size={24}
                  color={focused ? colors.primary : colors.subText}
                />
                <Text
                  style={{
                    fontSize: 11,
                    marginTop: 2,
                    color: focused ? colors.primary : colors.subText,
                  }}
                >
                  Profile
                </Text>
              </TouchableOpacity>
            );
          },
        }}
      />
    </Tabs>
  );
}
