import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import api from "../src/api/api";
import { router } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";

export default function AddExpensePage() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  async function addExpense() {
    if (!amount) {
      Alert.alert("Enter amount");
      return;
    }

    try {
      await api.post("/api/expenses", {
        amount,
        note,
      });

      router.replace("/(tabs)");
    } catch {
      Alert.alert("Failed to add expense");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Expense</Text>

      <TextInput
        placeholder="Amount"
        keyboardType="numeric"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        placeholder="Note"
        style={styles.input}
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity style={styles.btn} onPress={addExpense}>
        <Text style={styles.btnText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#000" },
  title: { color: "#fff", fontSize: 22, marginBottom: 20 },
  input: {
    backgroundColor: "#111",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "#000", fontWeight: "600" },
});
