import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/* =====================================================
   Request notification permission (call ONCE at app start)
===================================================== */
export async function requestNotificationPermission() {
  try {
    const { status } = await Notifications.getPermissionsAsync();

    if (status !== "granted") {
      await Notifications.requestPermissionsAsync();
    }

    // Android notification channel (REQUIRED)
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  } catch (err) {
    console.error("Notification permission error", err);
  }
}

/* =====================================================
   Send budget warning notification (immediate)
===================================================== */
export async function sendBudgetNotification(message: string) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚠️ Budget Alert",
        body: message,
        sound: "default",
      },
      trigger: null, // fire immediately
    });
  } catch (err) {
    console.error("sendBudgetNotification failed", err);
  }
}
