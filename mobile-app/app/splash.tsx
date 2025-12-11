// app/splash.tsx
import React, { useEffect, useContext } from "react";
import { SafeAreaView, ActivityIndicator, View, Text } from "react-native";
import { router } from "expo-router";
import { AuthContext } from "../src/context/AuthContext";

/**
 * Splash: uses AuthContext to decide where to route (login or tabs).
 * Shows a spinner while auth state is restoring.
 */

export default function Splash() {
  const { token, loading } = useContext(AuthContext);

  useEffect(() => {
    // Wait for AuthContext to finish restoring token
    if (loading) return;

    if (token) {
      // user signed in -> go to tabs root
      router.replace("/(tabs)");
    } else {
      // not signed in -> go to login
      router.replace("/login");
    }
  }, [token, loading]);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#071025" }}>
      <View style={{ alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ color: "#9CA3AF", marginTop: 12 }}>{loading ? "Checking session…" : "Redirecting…"}</Text>
      </View>
    </SafeAreaView>
  );
}
