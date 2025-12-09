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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { ThemedText as Text } from "@/components/themed-text";
import { ThemedView as Card } from "@/components/themed-view";
import { useHabits } from "../src/context/HabitsContext";

// Set the native header title (removes the "(tabs)" segment)
export const options = {
  headerShown: false,
};

export default function NewHabitPage() {
  const { addHabit } = useHabits();
  const [title, setTitle] = useState("");

  function handleSave() {
    if (!title.trim()) {
      Alert.alert("Habit name required", "Please enter a habit title.");
      return;
    }

    addHabit({ title });
    Alert.alert("Habit added", "Your new habit has been created.", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* in-page header (keeps consistent look even if native header shown) */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#E5E7EB" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Habit</Text>
          <View style={{ width: 40 }} />
        </View>

        <Card style={styles.card}>
          <Text style={styles.label}>Habit name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. No sugar drinks"
            placeholderTextColor="#6B7280"
            value={title}
            onChangeText={setTitle}
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />

          <Text style={styles.helper}>
            For now we auto-pick icon & color. Later you can customize them.
          </Text>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="checkmark" size={18} color="#0F172A" />
            <Text style={styles.saveText}>Save habit</Text>
          </TouchableOpacity>
        </Card>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
    marginBottom: 24,
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  card: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#0F172A",
  },
  label: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#F9FAFB",
    marginBottom: 12,
  },
  helper: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 20,
  },
  saveButton: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#22C55E",
    paddingVertical: 10,
    borderRadius: 999,
  },
  saveText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
});
