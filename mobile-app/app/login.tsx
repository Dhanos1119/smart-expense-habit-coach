import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";

import { AuthContext } from "../src/context/AuthContext";
import { useGoogleAuth } from "../src/auth/googleAuth";
import api from "../src/api/api";
import * as AppleAuthentication from "expo-apple-authentication";

export default function LoginScreen() {
  const { login, loginWithToken } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- GOOGLE AUTH ---------------- */
  const [request, response, promptAsync] = useGoogleAuth();

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        handleGoogleBackend(idToken);
      }
    }
  }, [response]);

  async function handleGoogleBackend(idToken: string) {
    try {
      setLoading(true);

      const res = await api.post("/api/auth/google", { idToken });

      // ✅ token-based login (NO dummy password)
      await loginWithToken(res.data.token);

      router.replace("/(tabs)");
    } catch (e) {
      Alert.alert("Google Login Failed");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- APPLE AUTH ---------------- */
  async function handleAppleLogin() {
    try {
      setLoading(true);

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        ],
      });

      if (!credential.identityToken) {
        throw new Error("No Apple identity token");
      }

      const res = await api.post("/api/auth/apple", {
        identityToken: credential.identityToken,
      });

      // ✅ token-based login
      await loginWithToken(res.data.token);

      router.replace("/(tabs)");
    } catch {
      Alert.alert("Apple Login Failed");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- NORMAL LOGIN ---------------- */
  async function handleLogin() {
  if (!email || !password) {
    Alert.alert("Missing", "Enter email and password");
    return;
  }

  try {
    setLoading(true);

    // 🔥 login() now saves token internally
    await login({ email, password });

    router.replace("/(tabs)");
  } catch {
    Alert.alert("Login failed", "Invalid email or password");
  } finally {
    setLoading(false);
  }
}

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="lock-closed-outline" size={36} color="#ffffff" />
      </View>

      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>You’ve been missed!</Text>

      <View style={styles.inputWrap}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        style={[styles.signInBtn, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.signInText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.orText}>or continue with</Text>

      <View style={styles.socialRow}>
        {/* GOOGLE */}
        <TouchableOpacity
          style={styles.socialBtn}
          onPress={() => promptAsync()}
          disabled={!request || loading}
        >
          <AntDesign name="google" size={22} color="#000" />
        </TouchableOpacity>

        {/* APPLE */}
        {Platform.OS === "ios" && (
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={handleAppleLogin}
            disabled={loading}
          >
            <Ionicons name="logo-apple" size={22} color="#000" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.registerRow}>
        <Text style={styles.registerText}>Not a member?</Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.registerLink}> Register now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
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
  signInBtn: {
    width: "100%",
    backgroundColor: "#ffffff",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 26,
  },
  signInText: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "600",
  },
  orText: {
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 16,
  },
  socialRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 30,
  },
  socialBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  registerRow: {
    flexDirection: "row",
  },
  registerText: {
    color: "#9ca3af",
  },
  registerLink: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
