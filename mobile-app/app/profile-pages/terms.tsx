import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/context/ThemeContext";

export default function TermsPage() {
  const router = useRouter();
  const { colors } = useTheme(); // ✅ theme colors

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* BACK BUTTON */}
      <TouchableOpacity
        style={styles.backRow}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
        <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>
        Terms & Conditions
      </Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.text, { color: colors.subText }]}>
          Welcome to Smart Expense Habit Coach. By using this app, you agree to:
        </Text>

        <Text style={[styles.bullet, { color: colors.primary }]}>
          • You are responsible for your financial data stored in the app.
        </Text>
        <Text style={[styles.bullet, { color: colors.primary }]}>
          • We do not share your personal or financial data with third parties.
        </Text>
        <Text style={[styles.bullet, { color: colors.primary }]}>
          • App performance may vary based on device and network conditions.
        </Text>
        <Text style={[styles.bullet, { color: colors.primary }]}>
          • Features may change with updates for better user experience.
        </Text>

        <Text style={[styles.text, { color: colors.subText }]}>
          Using this app means you agree to follow these terms.  
          If you disagree, please stop using the app.
        </Text>

        <Text style={[styles.footer, { color: colors.subText }]}>
          Last updated: December 2025
        </Text>
      </ScrollView>
    </View>
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
    marginBottom: 15,
  },

  content: {
    marginTop: 10,
  },

  text: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },

  bullet: {
    fontSize: 15,
    marginBottom: 10,
  },

  footer: {
    marginTop: 30,
    fontSize: 13,
    marginBottom: 50,
  },
});
