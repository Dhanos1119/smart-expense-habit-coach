// app/_layout.tsx  (or wherever your RootLayout is)
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
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </MonthProvider>
      </HabitsProvider>
    </ExpensesProvider>
  );
}
