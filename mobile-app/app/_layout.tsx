// app/_layout.tsx
import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

// 🔥 Global Theme (our custom theme system)
import { ThemeProvider as AppThemeProvider } from "../src/context/ThemeContext";

// App contexts
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
    // 🌗 OUR ThemeProvider (dark / light / system / auto-time)
    <AppThemeProvider>
      <AuthProvider>
        <MonthProvider>
          <ExpensesProvider>
            <HabitsProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </HabitsProvider>
          </ExpensesProvider>
        </MonthProvider>
      </AuthProvider>
    </AppThemeProvider>
  );
}
