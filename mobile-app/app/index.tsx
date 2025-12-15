import React, { useEffect, useContext } from "react";
import { SafeAreaView, ActivityIndicator, Text } from "react-native";
import { router } from "expo-router";
import { AuthContext } from "../src/context/AuthContext";

export default function Index() {
  const { token, loading } = useContext(AuthContext);

  useEffect(() => {
    if (loading) return; // ⏳ wait till token restore

    if (token) {
      router.replace("/(tabs)"); // ✅ auto login
    } else {
      router.replace("/login"); // ❌ no token → login
    }
  }, [loading, token]);

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
