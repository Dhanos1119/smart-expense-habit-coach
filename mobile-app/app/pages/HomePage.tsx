import React from "react";
import { TouchableOpacity, ScrollView, SafeAreaView } from "react-native";

import { ThemedText as Text } from "@/components/themed-text";
import { ThemedView as View } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { homeStyles } from "../../src/styles/homeStyles";

const styles = homeStyles;

export default function HomePage() {
  const user = {
    name: "Dhanoo",
    message: "Let’s keep your spending healthy today.",
  };

  const expenseSummary = {
    total: 42000,
    currency: "LKR",
    trend: "down" as "down" | "up",
    percentage: 12,
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

  function formatCurrency(amount: number, currency: string) {
    return `${currency} ${amount.toLocaleString("en-LK")}`;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user.name} 👋</Text>
            <Text style={styles.subGreeting}>{user.message}</Text>
          </View>

          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Expense Summary Card */}
        <View style={[styles.card, styles.expenseCard]}>
          <Text style={styles.cardTitle}>Month to Date</Text>
          <Text style={styles.expenseAmount}>
            {formatCurrency(expenseSummary.total, expenseSummary.currency)}
          </Text>
          <View style={styles.trendContainer}>
            <Ionicons
              name={
                expenseSummary.trend === "down" ? "arrow-down" : "arrow-up"
              }
              size={16}
              color={expenseSummary.trend === "down" ? "#4CAF50" : "#F44336"}
            />
            <Text style={styles.trendText}>
              {expenseSummary.percentage}%{" "}
              {expenseSummary.trend === "down" ? "less" : "more"} than last
              month
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/add-expense")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#E3F2FD" }]}>
              <Ionicons name="add" size={24} color="#2196F3" />
            </View>
            <Text style={styles.actionText}>Add Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: "#FFF3E0" }]}>
              <Ionicons name="flame" size={24} color="#FF9800" />
            </View>
            <Text style={styles.actionText}>New Habit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/explore")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#E8F5E9" }]}>
              <Ionicons name="stats-chart" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
        </View>

        {/* Habits Section */}
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
      </ScrollView>
    </SafeAreaView>
  );
}
