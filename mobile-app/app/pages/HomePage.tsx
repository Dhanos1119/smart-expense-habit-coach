// app/pages/HomePage.tsx
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
  TextInput,
  Text as RNText,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useMonth } from "../../src/context/MonthContext";
import { createHomeStyles } from "../../src/styles/homeStyles";

import { useExpenses } from "../../src/context/ExpensesContext";
import { useHabits } from "../../src/context/HabitsContext";
import { useTheme } from "../../src/context/ThemeContext";
import api from "../../src/api/api";
import { Text, View as Card } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../../src/context/AuthContext";

/* ----------------- helper utils ----------------- */
function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-LK")}`;
}

const DEV_OVERRIDE_DATE: string | null = null;

function getTodayStr() {
  if (DEV_OVERRIDE_DATE) return DEV_OVERRIDE_DATE;
  return new Date().toISOString().slice(0, 10);
}

function monthName(monthIndex: number) {
  return [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ][monthIndex];
}
/* -------------------------------------------------------------------- */

export default function HomePage() {
  // contexts
  const { user } = useContext(AuthContext);
  const { colors } = useTheme();
  const styles = useMemo(
  () => createHomeStyles(colors),
  [colors]
);

  const {
    expenses,
    monthTotal,
    clearAllExpenses,
    monthlyBudget,
    setMonthlyBudget,
  } = useExpenses();

  const { habits, toggleHabitToday, deleteHabit } = useHabits();
  const { selectedYear, selectedMonthIndex, setYear, setMonth } = useMonth();
  const router = useRouter();

  // UI state
  const [filter, setFilter] = useState<"month" | "all">("month");
  const [budgetInput, setBudgetInput] = useState("");
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  /* ------------------ totals ------------------ */
  const allTimeTotal = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const selectedMonthTotal = useMemo(() => {
    return expenses
      .filter((e) => {
        const d = new Date(e.date || e.createdAt);
        return (
          d.getFullYear() === selectedYear &&
          d.getMonth() === selectedMonthIndex
        );
      })
      .reduce((s, e) => s + e.amount, 0);
  }, [expenses, selectedYear, selectedMonthIndex]);

  const { prevMonthYear, prevMonthIndex } = useMemo(() => {
    let y = selectedYear;
    let m = selectedMonthIndex - 1;
    if (m < 0) {
      m = 11;
      y = selectedYear - 1;
    }
    return { prevMonthYear: y, prevMonthIndex: m };
  }, [selectedYear, selectedMonthIndex]);

  const prevMonthTotal = useMemo(() => {
    return expenses
      .filter((e) => {
        const d = new Date(e.date || e.createdAt);
        return (
          d.getFullYear() === prevMonthYear &&
          d.getMonth() === prevMonthIndex
        );
      })
      .reduce((s, e) => s + e.amount, 0);
  }, [expenses, prevMonthYear, prevMonthIndex]);



const prevYearSameMonthTotal = useMemo(() => {
  const prevYear = selectedYear - 1;
  return expenses
    .filter((e) => {
      const d = new Date(e.date || e.createdAt);
      return (
        d.getFullYear() === prevYear &&
        d.getMonth() === selectedMonthIndex
      );
    })
    .reduce((s, e) => s + e.amount, 0);
}, [expenses, selectedYear, selectedMonthIndex]);

/* ------------------ trends ------------------ */
let trend: "up" | "down" | "same" = "same";
let trendPercent = 0;

if (prevYearSameMonthTotal === 0 && selectedMonthTotal > 0) {
  trend = "up";
  trendPercent = 100;
} else if (prevYearSameMonthTotal > 0) {
  const diff = selectedMonthTotal - prevYearSameMonthTotal;
  trendPercent = Math.round(
    (Math.abs(diff) / prevYearSameMonthTotal) * 100
  );
  trend = diff <= 0 ? "down" : "up";
}

let prevMonthTrend: "up" | "down" | "same" = "same";
let prevMonthPercent = 0;

if (prevMonthTotal === 0 && selectedMonthTotal > 0) {
  prevMonthTrend = "up";
  prevMonthPercent = 100;
} else if (prevMonthTotal > 0) {
  const diff = selectedMonthTotal - prevMonthTotal;
  prevMonthPercent = Math.round(
    (Math.abs(diff) / prevMonthTotal) * 100
  );
  prevMonthTrend = diff <= 0 ? "down" : "up";
}

/* ------------------ budget ------------------ */
const currentTotal =
  filter === "month" ? selectedMonthTotal : allTimeTotal;

const remaining =
  monthlyBudget != null
    ? Math.max(
        monthlyBudget -
          (filter === "month" ? selectedMonthTotal : monthTotal),
        0
      )
    : 0;

const usage =
  monthlyBudget != null && monthlyBudget > 0
    ? (filter === "month"
        ? selectedMonthTotal
        : monthTotal) / monthlyBudget
    : 0;

// ✅ THEME SAFE budget color
let budgetColor = colors.success;
if (usage >= 0.9) budgetColor = colors.danger;
else if (usage >= 0.5) budgetColor = colors.warning;

/* ------------------ actions ------------------ */
async function handleSaveBudget() {
  if (!budgetInput.trim()) return;

  const value = Number(budgetInput);
  if (isNaN(value) || value <= 0) {
    Alert.alert(
      "Invalid budget",
      "Please enter a valid number greater than 0."
    );
    return;
  }

  await api.post("/api/user/budget", { monthlyBudget: value });

  setMonthlyBudget(value);
  setBudgetInput("");
  setIsEditingBudget(false);
}

function goToAnalytics() {
  router.push("/(tabs)/explore");
}

function goPrevMonth() {
  let y = selectedYear;
  let m = selectedMonthIndex - 1;
  if (m < 0) {
    m = 11;
    y -= 1;
  }
  setYear(y);
  setMonth(m);
}

function goNextMonth() {
  let y = selectedYear;
  let m = selectedMonthIndex + 1;
  if (m > 11) {
    m = 0;
    y += 1;
  }
  setYear(y);
  setMonth(m);
}

/* ------------------ recent expenses ------------------ */
const today = getTodayStr();

const recentExpenses = useMemo(() => {
  return [...expenses]
    .sort((a, b) => {
      const da = new Date(a.date || a.createdAt).getTime();
      const db = new Date(b.date || b.createdAt).getTime();
      return db - da;
    })
    .slice(0, 5);
}, [expenses]);


 const hasExpenses = expenses.length > 0;

const chipStyle: any = {
  backgroundColor: colors.card,
  borderWidth: 1,
  borderColor: colors.border,
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 18,
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  marginTop: 10,
  alignSelf: "flex-start",
};

const chipTextStyle: any = {
  color: colors.subText,
  marginLeft: 6,
  fontSize: 13,
};

/* ------------------ UI render ------------------ */
return (
  <SafeAreaView
  style={[styles.screen, { backgroundColor: colors.background }]}
>

<ScrollView
  contentContainerStyle={[
    styles.contentContainer,
    { paddingBottom: 160 } // 👈 MUST
  ]}
  keyboardShouldPersistTaps="handled" // 👈 ADD THIS
>



      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {user?.name ?? "User"}
          </Text>
          <Text style={styles.subGreeting}>
            Let’s keep your spending healthy today.
          </Text>
        </View>
      </View>

      {/* EXPENSE SUMMARY CARD */}
      <Card style={[styles.card, styles.expenseCard]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={goPrevMonth} style={{ padding: 10 }}>
            <Ionicons
              name="chevron-back"
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>

          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={styles.cardTitle}>
              {monthName(selectedMonthIndex)} {selectedYear}
            </Text>
            <Text style={styles.cardSubtitle}>
              {filter === "month" ? "Month to Date" : "All-time Spend"}
            </Text>
          </View>

          <TouchableOpacity onPress={goNextMonth} style={{ padding: 10 }}>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.expenseAmount}>
          {formatCurrency(currentTotal, "LKR")}
        </Text>

        <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
          <View style={chipStyle}>
            <Ionicons
              name={prevMonthTrend === "down" ? "arrow-down" : "arrow-up"}
              size={14}
              color={
                prevMonthTrend === "down"
                  ? colors.success
                  : colors.danger
              }
            />
            <RNText style={chipTextStyle}>
              {prevMonthPercent}%{" "}
              {prevMonthTrend === "down" ? "less" : "more"} than{" "}
              {monthName(prevMonthIndex)} {prevMonthYear}
            </RNText>
          </View>

          <View style={chipStyle}>
            <Ionicons
              name={trend === "down" ? "arrow-down" : "arrow-up"}
              size={14}
              color={
                trend === "down" ? colors.success : colors.danger
              }
            />
            <RNText style={chipTextStyle}>
              {trendPercent}%{" "}
              {trend === "down" ? "less" : "more"} than{" "}
              {monthName(selectedMonthIndex)} {selectedYear - 1}
            </RNText>
          </View>
        </View>
      </Card>


        {/* QUICK ACTIONS */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/(tabs)/add-expense")}>
            <View style={[styles.actionIcon, { backgroundColor: "#E3F2FD" }]}>
              <Ionicons name="add" size={24} color="#2196F3" />
            </View>
            <Text style={styles.actionText}>Add Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/new-habit")}>
            <View style={[styles.actionIcon, { backgroundColor: "#FFF3E0" }]}>
              <Ionicons name="flame" size={24} color="#FF9800" />
            </View>
            <Text style={styles.actionText}>New Habit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={goToAnalytics}>
            <View style={[styles.actionIcon, { backgroundColor: "#E8F5E9" }]}>
              <Ionicons name="stats-chart" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/history")}>
            <View style={[styles.actionIcon, { backgroundColor: "#FEE2E2" }]}>
              <Ionicons name="time" size={24} color="#DC2626" />
            </View>
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* DAILY HABITS */}
    <Text style={[styles.sectionTitle, { color: colors.text }]}>
Daily Habits</Text>
        <View style={styles.habitsList}>
          {habits.map((habit) => {
            const completedToday =
  !!habit.lastCompletedDate &&
  habit.lastCompletedDate === today &&
  habit.streak > 0;


            return (
              <TouchableOpacity
                key={habit.id}
                style={styles.habitItem}
                activeOpacity={0.85}
                onPress={() => toggleHabitToday(habit.id)}
                onLongPress={() =>
                  Alert.alert("Delete habit?", `Are you sure you want to delete "${habit.title}"?`, [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: () => deleteHabit(habit.id) },
                  ])
                }
                delayLongPress={500}
              >
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                  <View style={[styles.habitIcon, { backgroundColor: habit.color + "20" }]}>
                    <Ionicons name={(habit.icon as any) || "star"} size={20} color={habit.color} />
                  </View>

                  <View style={styles.habitInfo}>
                    <Text style={styles.habitTitle}>{habit.title}</Text>
                    <Text style={styles.habitStreak}>
                      {habit.streak} day streak {completedToday ? "🔥" : ""}
                    </Text>
                  </View>
                </View>

                <View
  style={[
    styles.checkbox,
    completedToday && {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
  ]}
>

                  {completedToday && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* RECENT EXPENSES */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10, marginTop: 16 }}>
          <Text style={styles.sectionTitle}>Recent expenses</Text>

          <TouchableOpacity
            onPress={() =>
              Alert.alert("Delete all expenses?", "This will remove all your expenses permanently.", [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => clearAllExpenses() },
              ])
            }
            style={{ backgroundColor: "#E3F2FD"
, padding: 10, borderRadius: 999 }}
          >
            <Ionicons name="trash-outline" size={25} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <Card style={styles.recentCard}>
          {recentExpenses.length === 0 ? (
            <Text style={styles.recentEmptyText}>No expenses recorded yet. Add your first one!</Text>
          ) : (
            recentExpenses.map((e) => (
              <TouchableOpacity key={e.id} style={styles.recentRow} onPress={() => router.push({ pathname: "/expense/[id]", params: { id: e.id } })}>
                <View style={styles.recentLeft}>
                  <Text style={styles.recentTitle}>{e.title}</Text>
                  <Text style={styles.recentMeta}>
                    {e.category} • {e.date}
                  </Text>
                </View>
                <Text style={styles.recentAmount}>LKR {e.amount.toLocaleString("en-LK")}</Text>
              </TouchableOpacity>
            ))
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
