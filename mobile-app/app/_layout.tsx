// app/_layout.tsx
import { useEffect } from "react";
import { Stack } from "expo-router";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";

import { AuthProvider } from "../src/context/AuthContext";
import { ExpensesProvider } from "../src/context/ExpensesContext";
import { HabitsProvider } from "../src/context/HabitsContext";
import { MonthProvider } from "../src/context/MonthContext";

export default function RootLayout() {
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <ThemeProvider value={DarkTheme}>
      <AuthProvider>
        <MonthProvider>
          <ExpensesProvider>
            <HabitsProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </HabitsProvider>
          </ExpensesProvider>
        </MonthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
