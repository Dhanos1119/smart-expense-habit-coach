import React, { useEffect } from "react";
import { SafeAreaView, ActivityIndicator, Text } from "react-native";
import { router, useNavigationContainerRef } from "expo-router";

export default function Index() {
  const navReady = useNavigationContainerRef();

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Navigate ONLY when Expo Router is ready
      if (navReady.isReady()) {
        router.replace("/login");
      }
    }, 10);

    return () => clearTimeout(timeout);
  }, [navReady]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#071025",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#fff" />
      <Text style={{ color: "#aaa", marginTop: 10 }}>Loading…</Text>
    </SafeAreaView>
  );
}
