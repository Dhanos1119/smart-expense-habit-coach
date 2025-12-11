// app/login.tsx
import React, { useState, useContext } from "react";
import { SafeAreaView, View, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../src/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function doLogin() {
    if (!email || !password) {
      Alert.alert("Missing", "Enter email and password");
      return;
    }

    try {
      setBusy(true);
      await login({ email, password });
      router.replace("/(tabs)");
    } catch (err: any) {
      console.log("Login error:", err?.response?.data || err?.message || err);
      const message = err?.response?.data?.message || err?.message || "Login failed. Check credentials or server.";
      Alert.alert("Login failed", String(message));
    } finally {
      setBusy(false);
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

        <TouchableOpacity onPress={doLogin} style={[styles.button, busy ? { opacity: 0.7 } : {}]} disabled={busy}>
          {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign in</Text>}
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
