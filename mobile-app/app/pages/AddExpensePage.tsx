import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  Pressable,
  Alert,
  Platform,
  Keyboard,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

import { addExpenseStyles as styles } from "../../src/styles/addExpenseStyles";
import { useExpenses } from "../../src/context/ExpensesContext";

// Category order → Other last
const CATEGORIES = ["Food", "Travel", "Bills", "Shopping", "Other"];

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export default function AddExpensePage() {
  const today = new Date();

  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");

  const [selectedDate, setSelectedDate] = useState(today);
  const [dateText, setDateText] = useState(formatDate(today));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [category, setCategory] = useState<string | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const { addExpense } = useExpenses(); // 🔥 context handles backend
  const [error, setError] = useState("");

  /* ================= SAVE EXPENSE ================= */
  async function handleSave() {
    setError("");

    const numAmount = Number(amount);

    if (!amount.trim() || isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a valid title.");
      return;
    }

const payload = {
  amount: Number(amount),
  title: title.trim(),
  date: dateText,
  category: category && category.trim() !== "" ? category : "Other",
};


    try {
      await addExpense(payload); // ✅ ONLY ONCE
      Alert.alert("Success", "Expense saved successfully");

      // Reset form
      const now = new Date();
      setAmount("");
      setTitle("");
      setSelectedDate(now);
      setDateText(formatDate(now));
      setCategory(null);
      setShowCategoryPicker(false);
      setShowDatePicker(false);
      Keyboard.dismiss();
    } catch (e) {
      Alert.alert("Error", "Failed to save expense");
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Add Expense 💵</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* AMOUNT */}
        <Text style={styles.fieldLabel}>Amount (LKR)</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="e.g. 700"
          placeholderTextColor="#6b7280"
        />

        {/* TITLE */}
        <Text style={styles.fieldLabel}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Burger, Petrol, Bus ticket"
          placeholderTextColor="#6b7280"
        />

        {/* DATE */}
        <Text style={styles.fieldLabel}>Date (YYYY-MM-DD)</Text>
        <Pressable
          style={styles.dateBox}
          onPress={() => {
            Keyboard.dismiss();
            setShowCategoryPicker(false);
            setShowDatePicker(!showDatePicker);
          }}
        >
          <Text style={styles.dateText}>{dateText}</Text>
          <Ionicons name="calendar-outline" size={20} color="#9ca3af" />
        </Pressable>

        {showDatePicker && (
          <View
            style={{
              backgroundColor: "#111827",
              padding: 10,
              borderRadius: 10,
              marginVertical: 10,
            }}
          >
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "calendar"}
              themeVariant="dark"
              onChange={(event, date) => {
                if (event.type === "dismissed" || !date) return;
                setSelectedDate(date);
                setDateText(formatDate(date));
              }}
            />
          </View>
        )}

        {/* CATEGORY */}
        <Text style={styles.fieldLabel}>Category</Text>
        <Pressable
          style={styles.categoryBox}
          onPress={() => {
            Keyboard.dismiss();
            if (showDatePicker) setShowDatePicker(false);
            setShowCategoryPicker(!showCategoryPicker);
          }}
        >
          <Text style={styles.categoryText}>
            {category || "Choose category"}
          </Text>
          <Ionicons
            name={showCategoryPicker ? "chevron-up" : "chevron-down"}
            size={20}
            color="#9ca3af"
          />
        </Pressable>

        {showCategoryPicker && (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={category || "Other"}
              onValueChange={(val) => {
                setCategory(val);
                setShowCategoryPicker(false);
              }}
            >
              {CATEGORIES.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>
        )}

        {/* SAVE BUTTON */}
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Expense</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
