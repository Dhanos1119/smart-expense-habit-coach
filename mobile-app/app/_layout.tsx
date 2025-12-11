// app/_layout.tsx  (Root layout)
import React from "react";
import { ThemeProvider, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ExpensesProvider } from "../src/context/ExpensesContext";
import { HabitsProvider } from "../src/context/HabitsContext";
import { MonthProvider } from "../src/context/MonthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ExpensesProvider>
      <HabitsProvider>
        <MonthProvider>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack>
              {/* Splash decides where to go: login or tabs */}
              <Stack.Screen name="splash" options={{ headerShown: false }} />
              {/* Tabs group */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              {/* Other stack screens you want (modal etc) */}
              <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
              {/* Top-level screens (login, register, profile) will be handled by file routes */}
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </MonthProvider>
      </HabitsProvider>
    </ExpensesProvider>
  );
}
