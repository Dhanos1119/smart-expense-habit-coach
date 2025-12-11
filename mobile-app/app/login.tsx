// app/login.tsx
import React, { useState } from "react";
import { SafeAreaView, View, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function doLogin() {
    if (!email || !password) {
      Alert.alert("Missing", "Enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "/api/auth/login",
        { email, password },
        {
          baseURL: process.env.API_BASE_URL || "https://your-api.com", // set to your dev server or ngrok
          withCredentials: true, // keep if backend uses httpOnly cookie; otherwise optional
        }
      );

      const accessToken = res.data?.accessToken;
      if (!accessToken) {
        Alert.alert("Login error", "Server didn't return access token. Check backend.");
        setLoading(false);
        return;
      }

      // Save token to SecureStore (native)
      try {
        await SecureStore.setItemAsync("accessToken", accessToken);
      } catch (e) {
        console.warn("SecureStore save error:", e);
      }

      // Also save to localStorage for web fallback
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem("accessToken", accessToken);
        }
      } catch (e) {
        console.warn("localStorage save error:", e);
      }

      // Enter the app (replace so login isn't in back stack)
      router.replace("/"); // change to router.replace("/home") if your tabs root differs
    } catch (err: any) {
      console.log("Login error:", err?.response?.data || err?.message);
      Alert.alert("Login failed", err?.response?.data?.error || "Check credentials or server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Sign in</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />

        <TouchableOpacity onPress={doLogin} style={styles.button}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign in</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")} style={{ marginTop: 12 }}>
          <Text style={styles.link}>No account? Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#071025", justifyContent: "center", padding: 20 },
  card: { backgroundColor: "#0b1220", padding: 18, borderRadius: 12 },
  title: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#1f2937",
    padding: 12,
    borderRadius: 8,
    color: "#fff",
    marginTop: 10,
    backgroundColor: "#071524",
  },
  button: { backgroundColor: "#111827", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 16 },
  buttonText: { color: "#fff", fontWeight: "600" },
  link: { color: "#9CA3AF", textAlign: "center" },
});
