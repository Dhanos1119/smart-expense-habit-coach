// app/_layout.tsx
import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// 🌗 Global Theme
import { ThemeProvider as AppThemeProvider } from "../src/context/ThemeContext";

// App contexts
import { AuthProvider } from "../src/context/AuthContext";
import { ExpensesProvider } from "../src/context/ExpensesContext";
import { HabitsProvider } from "../src/context/HabitsContext";
import { MonthProvider } from "../src/context/MonthContext";

/* =====================================================
   🔔 GLOBAL NOTIFICATION HANDLER
   ⚠️ MUST BE OUTSIDE COMPONENT
===================================================== */
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});


export default function RootLayout() {
  useEffect(() => {
    async function prepare() {
      try {
        // 🟡 Keep splash until app is ready
        await SplashScreen.preventAutoHideAsync();

        // 🔔 Request notification permission (ONCE)
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== "granted") {
          await Notifications.requestPermissionsAsync();
        }

        // 🤖 Android notification channel (REQUIRED)
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.HIGH,
            sound: "default",
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
          });
        }

        // ⏳ Small delay for smooth startup
        await new Promise((resolve) => setTimeout(resolve, 600));
      } catch (e) {
        console.warn("App init error:", e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
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
