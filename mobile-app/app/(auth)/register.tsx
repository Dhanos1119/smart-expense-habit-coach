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

import { useTheme } from "../../src/context/ThemeContext";
import api from "../../src/api/api";
import { AuthContext } from "../../src/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const { colors } = useTheme(); // ✅ theme colors

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
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* ICON */}
      <View style={[styles.iconWrap, { backgroundColor: colors.card }]}>
        <Ionicons name="person-add-outline" size={34} color={colors.text} />
      </View>

      {/* TITLE */}
      <Text style={[styles.title, { color: colors.text }]}>
        Create account
      </Text>
      <Text style={[styles.subtitle, { color: colors.subText }]}>
        Start tracking smarter
      </Text>

      {/* INPUTS */}
      <View style={styles.inputWrap}>
        <TextInput
          placeholder="Name (optional)"
          placeholderTextColor={colors.subText}
          value={name}
          onChangeText={setName}
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.subText}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.subText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
        />
      </View>

      {/* REGISTER BUTTON */}
      <TouchableOpacity
        onPress={doRegister}
        disabled={loading}
        style={[
          styles.registerBtn,
          { backgroundColor: colors.primary },
          loading && { opacity: 0.7 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.registerText}>Register</Text>
        )}
      </TouchableOpacity>

      {/* LOGIN LINK */}
      <View style={styles.loginRow}>
        <Text style={[styles.loginText, { color: colors.subText }]}>
          Already have an account?
        </Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={[styles.loginLink, { color: colors.text }]}>
            {" "}
            Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
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

  registerBtn: {
    width: "100%",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 26,
  },

  registerText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },

  loginRow: {
    flexDirection: "row",
  },

  loginText: {},

  loginLink: {
    fontWeight: "600",
  },
});
