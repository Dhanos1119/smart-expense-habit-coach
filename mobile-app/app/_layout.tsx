// app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";

import { AuthProvider } from "../src/context/AuthContext";
import { UserProvider } from "../src/context/UserContext"; // 🔥 ADD THIS
import { ExpensesProvider } from "../src/context/ExpensesContext";
import { HabitsProvider } from "../src/context/HabitsContext";
import { MonthProvider } from "../src/context/MonthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      {/* 🔥 USER CONTEXT MUST BE HERE */}
      <UserProvider>
        <ExpensesProvider>
          <HabitsProvider>
            <MonthProvider>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <Stack screenOptions={{ headerShown: false }}>
                  {/* Splash */}
                  <Stack.Screen name="index" />

                  {/* Auth */}
                  <Stack.Screen name="login" />
                  <Stack.Screen name="register" />

                  {/* Profile */}
                  <Stack.Screen name="profile" />

                  {/* Tabs */}
                  <Stack.Screen name="(tabs)" />

                  {/* Modal */}
                  <Stack.Screen
                    name="modal"
                    options={{ presentation: "modal" }}
                  />
                </Stack>

                <StatusBar style="light" />
              </ThemeProvider>
            </MonthProvider>
          </HabitsProvider>
        </ExpensesProvider>
      </UserProvider>
    </AuthProvider>
  );
}
