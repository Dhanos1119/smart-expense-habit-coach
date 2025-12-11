// app/profile.tsx
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, Button, ActivityIndicator, Alert, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useRouter } from "expo-router";

async function readToken() {
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

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const token = await readToken();
      if (!token) {
        router.replace("/login");
        return;
      }
      try {
        const res = await axios.get("/api/users/me", { baseURL: process.env.API_BASE_URL || "https://your-api.com", headers: { Authorization: `Bearer ${token}` } });
        if (!alive) return;
        setProfile(res.data);
      } catch (e) {
        console.warn("profile fetch error", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [router]);

  async function logout() {
    try { await SecureStore.deleteItemAsync("accessToken"); } catch {}
    try { if (typeof window !== "undefined") window.localStorage.removeItem("accessToken"); } catch {}
    router.replace("/login");
  }

  if (loading) return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.name}>{profile?.name ?? "User"}</Text>
        <Text style={styles.email}>{profile?.email ?? "—"}</Text>
      </View>

      <Button title="Logout" color="#D9534F" onPress={() => {
        Alert.alert("Logout", "Are you sure?", [{ text: "Cancel", style: "cancel" }, { text: "Logout", style: "destructive", onPress: logout }]);
      }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#071025" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  name: { color: "#fff", fontSize: 20, fontWeight: "700" },
  email: { color: "#9CA3AF", marginTop: 4 },
});
