// app/new-habit.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";
import { useHabits } from "../src/context/HabitsContext";

export const options = {
  headerShown: false,
};

export default function NewHabitPage() {
  const { colors, mode } = useTheme();
  const { addHabit } = useHabits();
  const [title, setTitle] = useState("");

  function handleSave() {
    if (!title.trim()) {
      Alert.alert("Habit name required", "Please enter a habit title.");
      return;
    }

    addHabit({ title: title.trim() });
    Alert.alert("Habit added", "Your new habit has been created.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  }

  return (
    <SafeAreaView
      style={[
        styles.screen,
        { backgroundColor: colors.background },
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.backBtn,
              { borderColor: colors.border },
            ]}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>
            New Habit
          </Text>

          <View style={{ width: 40 }} />
        </View>

        {/* CARD */}
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                mode === "dark"
                  ? "rgba(15, 23, 42, 0.95)"
                  : colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.label, { color: colors.subText }]}>
            Habit name
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor:
                  mode === "dark" ? "#020617" : colors.background,
              },
            ]}
            placeholder="e.g. No sugar drinks"
            placeholderTextColor={colors.subText}
            value={title}
            onChangeText={setTitle}
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />

          <Text style={[styles.helper, { color: colors.subText }]}>
            For now we auto-pick icon & color. Later you can customize them.
          </Text>

          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: colors.success },
            ]}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark" size={18} color="#022c22" />
            <Text style={styles.saveText}>Save habit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#020617", // 🔥 deep black-blue
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  card: {
    padding: 22,
    borderRadius: 24,
    backgroundColor: "rgba(15,23,42,0.9)", // ✅ glass dark
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },

  label: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 6,
  },

  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.45)",
    backgroundColor: "rgba(2,6,23,0.85)", // ✅ darker input
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#F9FAFB",
    marginBottom: 12,
  },

  helper: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 22,
  },

  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#22C55E", // ✅ KEEP GREEN
    paddingVertical: 14,
    borderRadius: 999,
  },

  saveText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
});
