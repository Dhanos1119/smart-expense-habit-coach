// app/expense/[id].tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  TextInput,
  Pressable,
  Alert,
  Platform,
  Text,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../../src/context/ThemeContext";

import { useExpenses } from "../../src/context/ExpensesContext";
import { addExpenseStyles } from "../../src/styles/addExpenseStyles";


const CATEGORIES = ["Food", "Travel", "Bills", "Shopping", "Other"];

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export default function ExpenseDetailsPage() {
  const { colors, mode } = useTheme();
 const styles = addExpenseStyles(colors);


  const { id } = useLocalSearchParams<{ id: string }>();
  const expenseId = Number(id);

  const { expenses, updateExpense, deleteExpense } = useExpenses();

  const expense = expenses.find((e) => e.id === expenseId) || null;


  if (!expense) {
    return (
      <SafeAreaView style={styles.screen}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#F9FAFB", fontSize: 16, marginBottom: 12 }}>
            Expense not found
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const initialDate = new Date(expense.date);

  const [amount, setAmount] = useState(String(expense.amount));
  const [title, setTitle] = useState(expense.title);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [dateText, setDateText] = useState(expense.date);
  const [category, setCategory] = useState<string>(expense.category);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [error, setError] = useState("");

  function handleSave() {
    if (!id) return;

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

    updateExpense(expenseId, {
    amount: numAmount,
    title: title.trim(),
    date: dateText,
    category: category || "Other",
  });

  Alert.alert("Updated", "Expense updated successfully.", [
    {
      text: "OK",
      onPress: () => router.back(),
    },
  ]);}

  function handleDelete() {
  if (!expenseId) return;

  Alert.alert(
    "Delete expense",
    "Are you sure you want to delete this expense?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteExpense(expenseId);
          router.back();
        },
      },
    ]
  );
}


  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Edit Expense ✏️</Text>

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
                if (event.type === "dismissed") return;
                if (!date) return;

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
            setShowDatePicker(false);
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
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </Pressable>

        {/* DELETE BUTTON */}
        <Pressable
          style={[
            styles.saveButton,
            { backgroundColor: "#991B1B", marginTop: 10 },
          ]}
          onPress={handleDelete}
        >
          <Text style={styles.saveButtonText}>Delete Expense</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
