// app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, DefaultTheme, DarkTheme } from "@react-navigation/native";

import { AuthProvider } from "../src/context/AuthContext";
import { ExpensesProvider } from "../src/context/ExpensesContext";
import { HabitsProvider } from "../src/context/HabitsContext";
import { MonthProvider } from "../src/context/MonthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ExpensesProvider>
        <HabitsProvider>
          <MonthProvider>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
              <Stack screenOptions={{ headerShown: false }}>
                
                {/* 👇 This IS your splash screen — index.tsx */}
                <Stack.Screen name="index" />

                {/* Auth screens */}
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />

                {/* Profile panel route */}
                <Stack.Screen name="profile" />

                {/* Tabs (home, explore, add...) */}
                <Stack.Screen name="(tabs)" />

                {/* Optional modal */}
                <Stack.Screen name="modal" options={{ presentation: "modal" }} />
              </Stack>

              <StatusBar style="light" />
            </ThemeProvider>
          </MonthProvider>
        </HabitsProvider>
      </ExpensesProvider>
    </AuthProvider>
  );
}
