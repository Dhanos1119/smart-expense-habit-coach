import * as Notifications from "expo-notifications";

export async function sendBudgetWarning(percent: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "⚠️ Budget Alert",
      body: `You’ve used ${percent}% of your monthly budget. Spend carefully.`,
      sound: "default",
    },
    trigger: null, // IMMEDIATE
  });
}
