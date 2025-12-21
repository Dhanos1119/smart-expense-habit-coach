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
  ActivityIndicator,
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
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert("Enter habit name", "Habit name cannot be empty");
      return;
    }

    if (saving) return; // 🔒 prevent double submit

    try {
      setSaving(true);

      await addHabit({ title: title.trim() });

      Alert.alert("Habit added", "Your new habit has been created.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert("Error", "Failed to add habit. Try again.");
    } finally {
      setSaving(false);
    }
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
            editable={!saving}
          />

          <Text style={[styles.helper, { color: colors.subText }]}>
            For now we auto-pick icon & color. Later you can customize them.
          </Text>

          <TouchableOpacity
            style={[
              styles.saveButton,
              {
                backgroundColor: colors.success,
                opacity: saving ? 0.7 : 1,
              },
            ]}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#0F172A" />
            ) : (
              <>
                <Ionicons name="checkmark" size={18} color="#022c22" />
                <Text style={styles.saveText}>Save habit</Text>
              </>
            )}
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
    backgroundColor: "#020617",
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
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  card: {
    padding: 22,
    borderRadius: 24,
    borderWidth: 1,
  },

  label: {
    fontSize: 14,
    marginBottom: 6,
  },

  input: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
  },

  helper: {
    fontSize: 12,
    marginBottom: 22,
  },

  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 999,
  },

  saveText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
});
