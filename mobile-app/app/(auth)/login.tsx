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
import { useTheme } from "../../src/context/ThemeContext";

import { AuthContext } from "../../src/context/AuthContext";
import { useGoogleAuth } from "../../src/auth/googleAuth";
import api from "../../src/api/api";
import * as AppleAuthentication from "expo-apple-authentication";

export default function LoginScreen() {
  const { colors } = useTheme(); // ✅ theme colors
  const { login, loginWithToken } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = useGoogleAuth();

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.authentication?.idToken;
      if (idToken) handleGoogleBackend(idToken);
    }
  }, [response]);

  async function handleGoogleBackend(idToken: string) {
    try {
      setLoading(true);
      const res = await api.post("/api/auth/google", { idToken });
      await loginWithToken(res.data.token);
    } catch {
      Alert.alert("Google Login Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Missing", "Enter email and password");
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.card }]}>
        <Ionicons name="lock-closed-outline" size={36} color={colors.text} />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>
        Welcome back
      </Text>
      <Text style={[styles.subtitle, { color: colors.subText }]}>
        You’ve been missed!
      </Text>

      <View style={styles.inputWrap}>
        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.subText}
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.subText}
          secureTextEntry
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        style={[styles.signInBtn, { backgroundColor: colors.primary }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.signInText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <Text style={[styles.orText, { color: colors.subText }]}>
        or continue with
      </Text>

      <View style={styles.socialRow}>
        <TouchableOpacity
          style={[styles.socialBtn, { backgroundColor: colors.card }]}
          onPress={() => promptAsync()}
          disabled={!request || loading}
        >
          <AntDesign name="google" size={22} color={colors.text} />
        </TouchableOpacity>

        {Platform.OS === "ios" && (
          <TouchableOpacity
            style={[styles.socialBtn, { backgroundColor: colors.card }]}
          >
            <Ionicons name="logo-apple" size={22} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.registerRow}>
        <Text style={{ color: colors.subText }}>Not a member?</Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={{ color: colors.primary, fontWeight: "600" }}>
            {" "}
            Register now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ---------- STATIC STYLES (NO COLORS HERE) ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 70,
  },
  iconWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 34,
  },
  inputWrap: {
    width: "100%",
  },
  input: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    fontSize: 15,
  },
  signInBtn: {
    width: "100%",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 26,
  },
  signInText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  orText: {
    fontSize: 13,
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
    alignItems: "center",
    justifyContent: "center",
  },
  registerRow: {
    flexDirection: "row",
  },
});
