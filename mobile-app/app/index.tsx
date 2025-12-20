// app/index.tsx
import { useContext, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { AuthContext } from "../src/context/AuthContext";

export default function Index() {
  const { token, loading } = useContext(AuthContext);

  useEffect(() => {
    if (loading) return;

    if (!token) {
      router.replace("/(auth)/login"); // 🔐 FORCE LOGIN
    } else {
      router.replace("/(tabs)"); // ✅ HOME
    }
  }, [loading, token]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
