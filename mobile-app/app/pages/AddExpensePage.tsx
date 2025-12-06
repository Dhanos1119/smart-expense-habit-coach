// app/pages/AddExpensePage.tsx
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
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

import { addExpenseStyles as styles } from "../../src/styles/addExpenseStyles";

const CATEGORIES = ["Food", "Travel", "Bills", "Shopping", "Other"];

type ListeningField = "amount" | "date" | "category" | null;

function formatDate(date: Date) {
  // YYYY-MM-DD
  return date.toISOString().slice(0, 10);
}

export default function AddExpensePage() {
  const today = new Date();

  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [dateText, setDateText] = useState(formatDate(today));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [error, setError] = useState("");
  const [listeningField, setListeningField] = useState<ListeningField>(null);

  // 🔊 Mic button – UI only (no real STT in Expo Go yet)
  function startListening(field: ListeningField) {
    if (listeningField === field) {
      setListeningField(null);
      return;
    }
    setListeningField(field);
    Alert.alert(
      "Voice input (coming soon)",
      "Expo Go direct speech-to-text support illa. Later dev build la mic use pannuvom. Ippo keyboard la type pannunga 😊"
    );
    setListeningField(null);
  }

  // ----- Date picker -----
  function onChangeDate(event: DateTimePickerEvent, date?: Date) {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }
    const chosen = date || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(chosen);
    setDateText(formatDate(chosen));
  }

  // ----- Save -----
  function handleSave() {
    setError("");

    if (!amount.trim() || isNaN(Number(amount))) {
      setError("Please enter a valid amount.");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    const payload = {
      amount: Number(amount),
      title: title.trim(),
      date: dateText || formatDate(new Date()),
      category: category || "Other",
    };

    console.log("New expense (local only):", payload);
    Alert.alert("Saved", "Expense captured locally. Backend coming soon!");

    // reset
    setAmount("");
    setTitle("");
    const now = new Date();
    setSelectedDate(now);
    setDateText(formatDate(now));
    setCategory(null);
  }

  const micColor = (field: ListeningField) =>
    listeningField === field ? "#22c55e" : "#9ca3af";

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Add Expense 💵</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Amount */}
        <Text style={styles.fieldLabel}>Amount (LKR)</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.inputFlex]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="e.g. 750"
            placeholderTextColor="#6b7280"
          />
          <Pressable
            style={styles.voiceButton}
            onPress={() => startListening("amount")}
          >
            <Ionicons
              name={listeningField === "amount" ? "mic" : "mic-outline"}
              size={20}
              color={micColor("amount")}
            />
          </Pressable>
        </View>

        {/* Title */}
        <Text style={styles.fieldLabel}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Burger, Bus ticket, Electricity bill"
          placeholderTextColor="#6b7280"
        />

        {/* Date */}
        <Text style={styles.fieldLabel}>Date (YYYY-MM-DD)</Text>
        <View style={styles.inputRow}>
          <Pressable
            style={[styles.dateBox, styles.inputFlex]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text
              style={[
                styles.dateText,
                !dateText && styles.datePlaceholder,
              ]}
            >
              {dateText || "auto = today"}
            </Text>
            <Ionicons name="calendar-outline" size={18} color="#9ca3af" />
          </Pressable>

          <Pressable
            style={styles.voiceButton}
            onPress={() => startListening("date")}
          >
            <Ionicons
              name={listeningField === "date" ? "mic" : "mic-outline"}
              size={20}
              color={micColor("date")}
            />
          </Pressable>
        </View>

        {/* Native DatePicker (hidden until tap) */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeDate}
          />
        )}

        {/* Category */}
        <Text style={styles.fieldLabel}>Category</Text>
        <View style={styles.inputRow}>
          <Pressable
            style={[styles.categoryBox, styles.inputFlex]}
            onPress={() => setShowCategoryPicker((s) => !s)}
          >
            <Text style={styles.categoryText}>
              {category || "Choose category"}
            </Text>
            <Ionicons
              name={showCategoryPicker ? "chevron-up" : "chevron-down"}
              size={18}
              color="#9ca3af"
            />
          </Pressable>

          <Pressable
            style={styles.voiceButton}
            onPress={() => startListening("category")}
          >
            <Ionicons
              name={listeningField === "category" ? "mic" : "mic-outline"}
              size={20}
              color={micColor("category")}
            />
          </Pressable>
        </View>

        {showCategoryPicker && (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={category || "Other"}
              onValueChange={(val) => setCategory(val)}
              dropdownIconColor="#e5e7eb"
            >
              {CATEGORIES.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>
        )}

        <Text style={styles.voiceHint}>
          Mic UI ready – real speech-to-text we’ll plug in when we move to a dev
          build. For now, just type the values 😊
        </Text>

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Expense</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
