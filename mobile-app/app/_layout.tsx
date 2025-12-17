// app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";

import { useColorScheme } from "@/hooks/use-color-scheme";

// CONTEXT PROVIDERS
import { AuthProvider } from "../src/context/AuthContext";
import { UserProvider } from "../src/context/UserContext";
import { ExpensesProvider } from "../src/context/ExpensesContext";
import { HabitsProvider } from "../src/context/HabitsContext";
import { MonthProvider } from "../src/context/MonthContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <UserProvider>
          <MonthProvider>
            <ExpensesProvider>
              <HabitsProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  {/* ENTRY */}
                  <Stack.Screen name="index" />

                  {/* AUTH */}
                  <Stack.Screen name="login" />
                  <Stack.Screen name="register" />

                  {/* PROFILE */}
                  <Stack.Screen name="profile" />

                  {/* MAIN TABS */}
                  <Stack.Screen name="(tabs)" />

                  {/* MODAL */}
                  <Stack.Screen
                    name="modal"
                    options={{ presentation: "modal" }}
                  />
                </Stack>

                <StatusBar style="light" />
              </HabitsProvider>
            </ExpensesProvider>
          </MonthProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
