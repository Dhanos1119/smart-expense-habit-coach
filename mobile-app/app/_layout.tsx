// app/_layout.tsx  (Root layout) — AuthProvider integrated
import React, { useContext } from "react";
import { ThemeProvider, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AuthProvider, AuthContext } from "../src/context/AuthContext";
import { ExpensesProvider } from "../src/context/ExpensesContext";
import { HabitsProvider } from "../src/context/HabitsContext";
import { MonthProvider } from "../src/context/MonthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

function InnerLayoutStack() {
  // If you later want to gate routes here, you can read token/loading from AuthContext.
  // const { token, loading } = useContext(AuthContext);
  // and render different Stack.Screen blocks depending on auth state.
  return (
    <Stack>
      {/* Splash decides where to go: login or tabs */}
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      {/* Tabs group */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Other stack screens you want (modal etc) */}
      <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
      {/* Top-level screens (login, register, profile) will be handled by file routes */}
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // AuthProvider should wrap everything so all contexts/screens can access auth
    <AuthProvider>
      <ExpensesProvider>
        <HabitsProvider>
          <MonthProvider>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
              <InnerLayoutStack />
              <StatusBar style="auto" />
            </ThemeProvider>
          </MonthProvider>
        </HabitsProvider>
      </ExpensesProvider>
    </AuthProvider>
  );
}
