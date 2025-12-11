// app/register.tsx
import React, { useState } from "react";
import { SafeAreaView, View, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function doRegister() {
    if (!email || !password) return Alert.alert("Missing", "Enter email and password");
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/auth/register",
        { name, email, password },
        { baseURL: process.env.API_BASE_URL || "https://your-api.com", withCredentials: true }
      );

      // Expect backend to return accessToken in response
      const accessToken = res.data?.accessToken;
      if (!accessToken) {
        Alert.alert("Register error", "Server didn't return access token. Please login instead.");
        setLoading(false);
        return;
      }

      // Save token
      try { await SecureStore.setItemAsync("accessToken", accessToken); } catch (e) { console.warn(e); }
      try { if (typeof window !== "undefined" && window.localStorage) window.localStorage.setItem("accessToken", accessToken); } catch (e) {}

      // Enter app
      router.replace("/");

    } catch (err: any) {
      console.log("Register error:", err?.response?.data || err?.message);
      Alert.alert("Register failed", err?.response?.data?.error || "Check server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Create account</Text>
        <TextInput placeholder="Name (optional)" value={name} onChangeText={setName} style={styles.input} placeholderTextColor="#9CA3AF" />
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} placeholderTextColor="#9CA3AF" />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} placeholderTextColor="#9CA3AF" />
        <TouchableOpacity onPress={doRegister} style={styles.button}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")} style={{ marginTop: 12 }}>
          <Text style={styles.link}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#071025", justifyContent: "center", padding: 20 },
  card: { backgroundColor: "#0b1220", padding: 18, borderRadius: 12 },
  title: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#1f2937", padding: 12, borderRadius: 8, color: "#fff", marginTop: 10, backgroundColor: "#071524" },
  button: { backgroundColor: "#111827", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 16 },
  buttonText: { color: "#fff", fontWeight: "600" },
  link: { color: "#9CA3AF", textAlign: "center" },
});
