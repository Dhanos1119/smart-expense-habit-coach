// app/splash.tsx
import React, { useEffect } from "react";
import { SafeAreaView, ActivityIndicator, View, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

/**
 * Splash: reads token and routes to login or tabs.
 * This runs when app launches (root layout will show it first).
 */

async function readToken(): Promise<string | null> {
  try {
    const v = await SecureStore.getItemAsync("accessToken");
    if (v) return v;
  } catch {}
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem("accessToken");
    }
  } catch {}
  return null;
}

export default function Splash() {
  useEffect(() => {
    let mounted = true;
    (async () => {
      const token = await readToken();
      if (!mounted) return;
      if (token) {
        // user signed in -> go to tabs root
        router.replace("/");
      } else {
        // not signed in -> go to login
        router.replace("/login");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#071025" }}>
      <View style={{ alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ color: "#9CA3AF", marginTop: 12 }}>Checking session…</Text>
      </View>
    </SafeAreaView>
  );
}
