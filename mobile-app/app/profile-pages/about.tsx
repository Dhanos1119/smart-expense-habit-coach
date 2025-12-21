import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/context/ThemeContext";

export default function AboutPage() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* BACK */}
      <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
        <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>
          About This App
        </Text>

        <Text style={[styles.text, { color: colors.subText }]}>
          Smart Expense Habit Coach is designed to help you manage your
          personal finances, track daily expenses, and build healthy habits
          to improve your financial discipline.
        </Text>

        {/* FEATURES */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Key Features
          </Text>

          <Text style={[styles.bullet, { color: colors.primary }]}>
            • Track daily and monthly expenses easily
          </Text>
          <Text style={[styles.bullet, { color: colors.primary }]}>
            • Set monthly budgets and monitor spending
          </Text>
          <Text style={[styles.bullet, { color: colors.primary }]}>
            • Build and maintain positive financial habits
          </Text>
          <Text style={[styles.bullet, { color: colors.primary }]}>
            • View analytics and spending insights
          </Text>
          <Text style={[styles.bullet, { color: colors.primary }]}>
            • Dark & Light theme support
          </Text>
          <Text style={[styles.bullet, { color: colors.primary }]}>
            • Secure user authentication
          </Text>
        </View>

        {/* PURPOSE */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Our Goal
          </Text>

          <Text style={[styles.text, { color: colors.subText }]}>
            Our goal is to help users become more aware of their spending
            habits, make better financial decisions, and gradually improve
            their overall financial well-being.
          </Text>
        </View>

        {/* VERSION */}
        <View style={styles.footer}>
          <Text style={{ color: colors.subText, fontSize: 13 }}>
            Version 1.0.0
          </Text>
          <Text style={{ color: colors.subText, fontSize: 13 }}>
            © 2025 Smart Expense Habit Coach
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 55,
  },

  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  backText: {
    fontSize: 16,
    marginLeft: 6,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },

  text: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },

  section: {
    marginTop: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  bullet: {
    fontSize: 15,
    marginBottom: 8,
  },

  footer: {
    marginTop: 40,
    marginBottom: 50,
    alignItems: "center",
    gap: 4,
  },
});
