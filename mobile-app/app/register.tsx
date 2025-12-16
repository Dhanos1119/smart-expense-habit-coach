import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

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

      await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      // auto login after register
      try {
        await login({ email, password });
        router.replace("/(tabs)");
      } catch {
        Alert.alert("Registered", "Account created — please sign in.");
        router.replace("/login");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Register failed";
      Alert.alert("Error", String(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ICON */}
      <View style={styles.iconWrap}>
        <Ionicons name="person-add-outline" size={34} color="#ffffff" />
      </View>

      {/* TITLE */}
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Start tracking smarter</Text>

      {/* INPUTS */}
      <View style={styles.inputWrap}>
        <TextInput
          placeholder="Name (optional)"
          placeholderTextColor="#9ca3af"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* REGISTER BUTTON */}
      <TouchableOpacity
        onPress={doRegister}
        disabled={loading}
        style={[styles.registerBtn, loading && { opacity: 0.7 }]}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.registerText}>Register</Text>
        )}
      </TouchableOpacity>

      {/* LOGIN LINK */}
      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginLink}> Sign in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 70,
  },

  iconWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
  },

  subtitle: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 34,
  },

  inputWrap: {
    width: "100%",
  },

  input: {
    backgroundColor: "#111111",
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    fontSize: 15,
    color: "#ffffff",
  },

  registerBtn: {
    width: "100%",
    backgroundColor: "#ffffff",
    paddingVertical: 13, // same height as login
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 26,
  },

  registerText: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "600",
  },

  loginRow: {
    flexDirection: "row",
  },

  loginText: {
    color: "#9ca3af",
  },

  loginLink: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
