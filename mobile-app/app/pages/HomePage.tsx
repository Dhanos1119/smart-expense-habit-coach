// app/pages/HomePage.tsx
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { homeStyles as styles } from "../../src/styles/homeStyles";
import { useExpenses } from "../../src/context/ExpensesContext";
import { useHabits } from "../../src/context/HabitsContext";

import { ThemedText as Text } from "@/components/themed-text";
import { ThemedView as Card } from "@/components/themed-view";

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-LK")}`;
}

export default function HomePage() {
  const {
    expenses,
    monthTotal,
    clearAllExpenses,
    monthlyBudget,
    setMonthlyBudget,
  } = useExpenses();

  const { habits, toggleHabitToday, deleteHabit } = useHabits();

  const [filter, setFilter] = useState<"month" | "all">("month");
  const [budgetInput, setBudgetInput] = useState("");

  const allTimeTotal = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const currentTotal = filter === "month" ? monthTotal : allTimeTotal;

  // ---- trend calculation (this month vs last month) ----
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth(); // 0–11
  const prevMonth = (thisMonth + 11) % 12;
  const prevYear = prevMonth === 11 ? thisYear - 1 : thisYear;

  const prevMonthTotal = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  let trend: "up" | "down" | "same" = "same";
  let percentage = 0;

  if (prevMonthTotal === 0 && monthTotal > 0) {
    trend = "up";
    percentage = 100;
  } else if (prevMonthTotal > 0) {
    const diff = monthTotal - prevMonthTotal;
    percentage = Math.round((Math.abs(diff) / prevMonthTotal) * 100);
    trend = diff <= 0 ? "down" : "up";
  }

  const user = {
    name: "Dhanoo",
    message: "Let’s keep your spending healthy today.",
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  const hasExpenses = expenses.length > 0;

  const recentExpenses = useMemo(() => expenses.slice(0, 5), [expenses]);

  // 🔧 DEV date override for testing habits (same idea as HabitsContext)
const DEV_OVERRIDE_DATE: string | null = "2025-01-16"; 
// Example test-ku: "2025-01-10"  / "2025-01-11"  etc.
// Real app use panna pora time => null vainga

function getTodayStr() {
  if (DEV_OVERRIDE_DATE) return DEV_OVERRIDE_DATE;
  return new Date().toISOString().slice(0, 10);
}


  // ---- Budget derived values ----
  const remaining =
    monthlyBudget != null ? Math.max(monthlyBudget - monthTotal, 0) : 0;

  const usage =
    monthlyBudget != null && monthlyBudget > 0
      ? monthTotal / monthlyBudget
      : 0;

  let budgetColor = "#22C55E"; // green
  if (usage >= 0.9) budgetColor = "#EF4444"; // red
  else if (usage >= 0.5) budgetColor = "#EAB308"; // yellow

  function handleSaveBudget() {
    if (!budgetInput.trim()) return;
    const value = Number(budgetInput);
    if (isNaN(value) || value <= 0) {
      Alert.alert(
        "Invalid budget",
        "Please enter a valid number greater than 0."
      );
      return;
    }
    setMonthlyBudget(value);
    setBudgetInput("");
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user.name} 👋</Text>
            <Text style={styles.subGreeting}>{user.message}</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="person-circle-outline" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* EXPENSE SUMMARY CARD */}
        <Card style={[styles.card, styles.expenseCard]}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>
              {filter === "month" ? "Month to Date" : "All-time Spend"}
            </Text>

            <View style={styles.filterRow}>
              <TouchableOpacity
                onPress={() => setFilter("month")}
                style={[
                  styles.filterChip,
                  filter === "month" && styles.filterChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    filter === "month" && styles.filterChipTextActive,
                  ]}
                >
                  This month
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFilter("all")}
                style={[
                  styles.filterChip,
                  filter === "all" && styles.filterChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    filter === "all" && styles.filterChipTextActive,
                  ]}
                >
                  All time
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.expenseAmount}>
            {formatCurrency(currentTotal, "LKR")}
          </Text>

          <View style={styles.trendContainer}>
            {filter === "month" ? (
              hasExpenses ? (
                <>
                  <Ionicons
                    name={trend === "down" ? "arrow-down" : "arrow-up"}
                    size={16}
                    color={trend === "down" ? "#4CAF50" : "#F44336"}
                  />
                  <Text style={styles.trendText}>
                    {percentage}% {trend === "down" ? "less" : "more"} than last
                    month
                  </Text>
                </>
              ) : (
                <Text style={styles.trendText}>
                  Add your first expense to begin
                </Text>
              )
            ) : (
              <Text style={styles.trendText}>
                Showing all recorded expenses so far
              </Text>
            )}
          </View>
        </Card>

        {/* BUDGET CARD */}
        <Card style={[styles.card, styles.budgetCard]}>
          {monthlyBudget == null ? (
            <>
              <View style={styles.budgetHeaderRow}>
                <Text style={styles.budgetLabel}>Set your monthly budget</Text>
              </View>

              <View style={styles.budgetInputRow}>
                <TextInput
                  style={styles.budgetInput}
                  placeholder="e.g. 40000"
                  placeholderTextColor="#6b7280"
                  keyboardType="numeric"
                  value={budgetInput}
                  onChangeText={setBudgetInput}
                />
                <TouchableOpacity
                  style={styles.budgetSaveButton}
                  onPress={handleSaveBudget}
                >
                  <Text style={styles.budgetSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.budgetHeaderRow}>
                <Text style={styles.budgetLabel}>Budget this month</Text>
                <Text style={styles.budgetAmount}>
                  {formatCurrency(monthlyBudget, "LKR")}
                </Text>
              </View>

              <View style={styles.budgetRow}>
                <Text style={styles.budgetSmall}>
                  Spent: {formatCurrency(monthTotal, "LKR")}
                </Text>
                <Text style={styles.budgetSmall}>
                  Remaining: {formatCurrency(remaining, "LKR")}
                </Text>
              </View>

              <View style={styles.budgetProgressBg}>
                <View
                  style={[
                    styles.budgetProgressFill,
                    {
                      width: `${Math.min(usage * 100, 100)}%`,
                      backgroundColor: budgetColor,
                    },
                  ]}
                />
              </View>

              {usage >= 0.9 ? (
                <Text style={styles.budgetWarning}>
                  You’re very close to your budget limit!
                </Text>
              ) : usage >= 0.5 ? (
                <Text style={styles.budgetWarning}>
                  You’ve used more than half of your budget.
                </Text>
              ) : null}
            </>
          )}
        </Card>

        {/* QUICK ACTIONS */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/(tabs)/add-expense")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#E3F2FD" }]}>
              <Ionicons name="add" size={24} color="#2196F3" />
            </View>
            <Text style={styles.actionText}>Add Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/new-habit")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#FFF3E0" }]}>
              <Ionicons name="flame" size={24} color="#FF9800" />
            </View>
            <Text style={styles.actionText}>New Habit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/(tabs)/explore")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#E8F5E9" }]}>
              <Ionicons name="stats-chart" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>

          {/* HISTORY QUICK ACTION */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/history")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#FEE2E2" }]}>
              <Ionicons name="time" size={24} color="#DC2626" />
            </View>
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* DAILY HABITS */}
        <Text style={styles.sectionTitle}>Daily Habits</Text>
        <View style={styles.habitsList}>
          {habits.map((habit) => {
             const todayStr = getTodayStr();  
            const completedToday = habit.lastCompletedDate === todayStr;

            return (
              <TouchableOpacity
                key={habit.id}
                style={styles.habitItem}
                activeOpacity={0.85}
                onPress={() => toggleHabitToday(habit.id)}
                onLongPress={() => {
                  Alert.alert(
                    "Delete habit?",
                    `Are you sure you want to delete "${habit.title}"?`,
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => deleteHabit(habit.id),
                      },
                    ]
                  );
                }}
                delayLongPress={500}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View
                    style={[
                      styles.habitIcon,
                      { backgroundColor: habit.color + "20" },
                    ]}
                  >
                    <Ionicons
                      name={(habit.icon as any) || "star"}
                      size={20}
                      color={habit.color}
                    />
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
                      backgroundColor: "#22C55E",
                      borderColor: "#22C55E",
                    },
                  ]}
                >
                  {completedToday && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* RECENT EXPENSES */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            marginTop: 16,
          }}
        >
          <Text style={styles.sectionTitle}>Recent expenses</Text>

          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Delete all expenses?",
                "This will remove all your expenses permanently.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => clearAllExpenses(),
                  },
                ]
              );
            }}
            style={{
              backgroundColor: "#1F2933",
              padding: 10,
              borderRadius: 999,
            }}
          >
            <Ionicons name="trash-outline" size={25} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <Card style={styles.recentCard}>
          {recentExpenses.length === 0 ? (
            <Text style={styles.recentEmptyText}>
              No expenses recorded yet. Add your first one!
            </Text>
          ) : (
            recentExpenses.map((e) => (
              <TouchableOpacity
                key={e.id}
                style={styles.recentRow}
                onPress={() =>
                  router.push({
                    pathname: "/expense/[id]",
                    params: { id: e.id },
                  })
                }
              >
                <View style={styles.recentLeft}>
                  <Text style={styles.recentTitle}>{e.title}</Text>
                  <Text style={styles.recentMeta}>
                    {e.category} • {e.date}
                  </Text>
                </View>
                <Text style={styles.recentAmount}>
                  LKR {e.amount.toLocaleString("en-LK")}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
