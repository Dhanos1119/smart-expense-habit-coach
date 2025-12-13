// app/splash.tsx
import React, { useEffect } from "react";
import { SafeAreaView, ActivityIndicator, View, Text } from "react-native";
import { router } from "expo-router";

export default function Splash() {
  useEffect(() => {
    // 🚀 Always redirect to login when app opens
    router.replace("/login");
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#071025",
      }}
    >
      <View style={{ alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: "#9CA3AF", marginTop: 12 }}>
          Redirecting to login…
        </Text>
      </View>
    </SafeAreaView>
  );
}
