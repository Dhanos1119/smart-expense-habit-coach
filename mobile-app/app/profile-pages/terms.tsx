import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/context/ThemeContext";


export default function TermsPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      
      {/* BACK BUTTON */}
      <TouchableOpacity style={styles.backRow} onPress={() => router.replace("/profile")}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Terms & Conditions</Text>

      <ScrollView style={styles.content}>
        <Text style={styles.text}>
          Welcome to Smart Expense Habit Coach. By using this app, you agree to:
        </Text>

        <Text style={styles.bullet}>• You are responsible for your financial data stored in the app.</Text>
        <Text style={styles.bullet}>• We do not share your personal or financial data with third parties.</Text>
        <Text style={styles.bullet}>• App performance may vary based on device and network conditions.</Text>
        <Text style={styles.bullet}>• Features may change with updates for better user experience.</Text>

        <Text style={styles.text}>
          Using this app means you agree to follow these terms.  
          If you disagree, please stop using the app.
        </Text>

        <Text style={styles.footer}>Last updated: December 2025</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#071025",
    paddingHorizontal: 18,
    paddingTop: 55,
  },

  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  backText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 6,
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
  },

  content: {
    marginTop: 10,
  },

  text: {
    color: "#C7CCD5",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },

  bullet: {
    color: "#9EB3FF",
    fontSize: 15,
    marginBottom: 10,
  },

  footer: {
    color: "#64748B",
    marginTop: 30,
    fontSize: 13,
    marginBottom: 50,
  },
});
