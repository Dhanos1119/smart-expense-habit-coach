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
import { useTheme } from "../src/context/ThemeContext";
import { addExpenseStyles } from "../src/styles/addExpenseStyles";
import { useExpenses } from "../src/context/ExpensesContext";

const CATEGORIES = ["Food", "Travel", "Bills", "Shopping", "Other"];

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function AddExpensePage() {
  const { colors } = useTheme();
  const styles = addExpenseStyles(colors);

  const today = new Date();

  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(today);
  const [dateText, setDateText] = useState(formatDate(today));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [error, setError] = useState("");

  const { addExpense } = useExpenses();

  async function handleSave() {
    setError("");

    const numAmount = Number(amount);
    if (!amount.trim() || isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    try {
      await addExpense({
        amount: numAmount,
        title: title.trim(),
        date: dateText,
        category: category || "Other",
      });

      Alert.alert("Success", "Expense saved");
      setAmount("");
      setTitle("");
      setSelectedDate(today);
      setDateText(formatDate(today));
      setCategory(null);
      Keyboard.dismiss();
    } catch {
      Alert.alert("Error", "Failed to save expense");
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Add Expense 💵</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.fieldLabel}>Amount (LKR)</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="e.g. 700"
          placeholderTextColor={colors.subText}
        />

        <Text style={styles.fieldLabel}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Petrol, Food"
          placeholderTextColor={colors.subText}
        />

        <Text style={styles.fieldLabel}>Date</Text>
        <Pressable
          style={styles.dateBox}
          onPress={() => setShowDatePicker(!showDatePicker)}
        >
          <Text style={styles.dateText}>{dateText}</Text>
          <Ionicons name="calendar-outline" size={20} color={colors.subText} />
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "calendar"}
            onChange={(_, d) => {
              if (!d) return;
              setSelectedDate(d);
              setDateText(formatDate(d));
            }}
          />
        )}

        <Text style={styles.fieldLabel}>Category</Text>
        <Pressable
          style={styles.categoryBox}
          onPress={() => setShowCategoryPicker(!showCategoryPicker)}
        >
          <Text style={styles.categoryText}>
            {category || "Choose category"}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.subText} />
        </Pressable>

        {showCategoryPicker && (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={category}
              onValueChange={(v) => {
                setCategory(v);
                setShowCategoryPicker(false);
              }}
            >
              {CATEGORIES.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>
        )}

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Expense</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
