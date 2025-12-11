// app/profile.tsx
import React, { useEffect, useState, useContext } from "react";
import { SafeAreaView, View, Text, Button, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../src/context/AuthContext";
import api from "../src/api/api"; // make sure this is your axios instance (src/api.ts)

export default function ProfilePage() {
  const router = useRouter();
  const { token, loading: authLoading, logout } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    let alive = true;

    // Wait until AuthContext finishes restoring token
    if (authLoading) {
      // don't fetch yet
      return;
    }

    (async () => {
      // If no token present, redirect to login
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        setLoading(true);
        // Use centralized axios instance (which should have Authorization header set by AuthContext)
        const res = await api.get("/api/users/me"); // adjust endpoint if your backend uses /users/me or /api/users/me
        if (!alive) return;
        setProfile(res.data);
      } catch (e) {
        console.warn("profile fetch error", e);
        // If 401, try logout via context (AuthContext may already handle 401 globally)
        try {
          // optional: if token invalid, force logout
          // await logout(); // uncomment if you want to forcibly logout on profile fetch failure
        } catch {}
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [authLoading, token, router]);

  async function handleLogout() {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout(); // AuthContext should clear storage + headers
          } catch (e) {
            console.warn("Logout error", e);
          } finally {
            router.replace("/login");
          }
        },
      },
    ]);
  }

  if (authLoading || loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.name}>{profile?.name ?? "User"}</Text>
        <Text style={styles.email}>{profile?.email ?? "—"}</Text>
      </View>

      <Button title="Logout" color="#D9534F" onPress={handleLogout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#071025" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  name: { color: "#fff", fontSize: 20, fontWeight: "700" },
  email: { color: "#9CA3AF", marginTop: 4 },
});
