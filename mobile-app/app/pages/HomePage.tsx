// app/pages/HomePage.tsx
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { homeStyles as styles } from "../../src/styles/homeStyles";
import { useExpenses } from "../../src/context/ExpensesContext";

import { ThemedText as Text } from "@/components/themed-text";
import { ThemedView as Card } from "@/components/themed-view";

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-LK")}`;
}

export default function HomePage() {
  const { expenses, monthTotal, clearAllExpenses } = useExpenses();

  // ---- filter: this month / all time ----
  const [filter, setFilter] = useState<"month" | "all">("month");

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

  const habits = [
    {
      id: "1",
      title: "No outside food",
      icon: "restaurant",
      color: "#FF9800",
      streak: 3,
      completedToday: false,
    },
    {
      id: "2",
      title: "Track every expense",
      icon: "create",
      color: "#2196F3",
      streak: 7,
      completedToday: true,
    },
    {
      id: "3",
      title: "No impulse buys",
      icon: "flash",
      color: "#4CAF50",
      streak: 2,
      completedToday: false,
    },
  ];

  const hasExpenses = expenses.length > 0;

  // 🔹 last 5 expenses
  const recentExpenses = useMemo(() => expenses.slice(0, 5), [expenses]);

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
            {/* small reset icon – dev use only */}
          
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="person-circle-outline" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* EXPENSE SUMMARY CARD */}
        <Card style={[styles.card, styles.expenseCard]}>
          {/* title + filter chips */}
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

          {/* amount */}
          <Text style={styles.expenseAmount}>
            {formatCurrency(currentTotal, "LKR")}
          </Text>

          {/* trend / helper text */}
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
  onPress={() => router.push("/history")}
>
  <View style={[styles.actionIcon, { backgroundColor: "#FEE2E2" }]}>
    <Ionicons name="time" size={24} color="#DC2626" />
  </View>
  <Text style={styles.actionText}>History</Text>
</TouchableOpacity>


          <TouchableOpacity style={styles.actionButton}>
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
        </View>

        {/* HABITS */}
        <Text style={styles.sectionTitle}>Daily Habits</Text>
        <View style={styles.habitsList}>
          {habits.map((habit) => (
            <View key={habit.id} style={styles.habitItem}>
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
                  {habit.streak} day streak
                </Text>
              </View>

              <View style={styles.checkbox}>
                {habit.completedToday && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
            </View>
          ))}
        </View>

        {/* RECENT EXPENSES HEADER WITH DELETE ICON */}
<View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  }}
>
  <Text style={styles.sectionTitle}>Recent expenses</Text>

  {/* TRASH DELETE BUTTON */}
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
    borderRadius: 12,
      padding: 8,
   }}
  >
    <Ionicons name="trash-outline" size={25} color="#bd2020ff" />
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
