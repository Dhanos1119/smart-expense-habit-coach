// app/register.tsx
import React, { useState, useContext } from "react";
import { SafeAreaView, View, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import api from "../src/api/api";
import { AuthContext } from "../src/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function doRegister() {
    if (!email || !password) {
      Alert.alert("Missing", "Enter email and password");
      return;
    }

    try {
      setLoading(true);

      // Hit backend via central api instance
      const res = await api.post("/api/auth/register", { name, email, password });

      // If backend returns token directly in the response, we can use it.
      // But safest: call login to get token + set context consistently.
      // Many backends return created user + token; if yours does, you can skip login call.
      // We'll try to auto-login using the same credentials.
      try {
        await login({ email, password });
        // If login succeeds, navigate into app
        router.replace("/(tabs)");
      } catch (loginErr) {
        // Registration success but auto-login failed; tell user to login manually
        console.warn("Auto-login after register failed", loginErr);
        Alert.alert("Registered", "Account created — please sign in.");
        router.replace("/login");
      }
    } catch (err: any) {
      console.log("Register error:", err?.response?.data || err?.message || err);
      const serverMsg = err?.response?.data?.message || err?.response?.data || err?.message;
      Alert.alert("Register failed", String(serverMsg) || "Check server");
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

        <TouchableOpacity onPress={doRegister} style={[styles.button, loading ? { opacity: 0.7 } : {}]} disabled={loading}>
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
