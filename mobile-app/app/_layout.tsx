// app/_layout.tsx
import { Stack } from "expo-router";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";

import { AuthProvider } from "../src/context/AuthContext";
import { ExpensesProvider } from "../src/context/ExpensesContext";
import { HabitsProvider } from "../src/context/HabitsContext";
import { MonthProvider } from "../src/context/MonthContext";

export default function RootLayout() {
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
