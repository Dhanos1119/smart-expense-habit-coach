// app/history.tsx
import React, { useMemo } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useExpenses } from "../src/context/ExpensesContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { ThemedText as Text } from "@/components/themed-text";
import { ThemedView as Card } from "@/components/themed-view";

function formatCurrency(amount: number) {
  return `LKR ${amount.toLocaleString("en-LK")}`;
}

function formatDate(d: string) {
  const date = new Date(d);
  return date.toDateString(); // Example: Mon Dec 02 2025
}

export default function HistoryPage() {
  const { expenses } = useExpenses();

  // Group by date → { "2025-12-02": [ ...expenses ], ... }
  const grouped = useMemo(() => {
    const map = new Map<string, any[]>();

    for (const e of expenses) {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date)!.push(e);
    }

    return Array.from(map.entries()).sort(
      (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
    );
  }, [expenses]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#020617" }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* HEADER */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "700" }}>
            Expense History
          </Text>

          {/* Back */}
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-circle" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* IF NO EXPENSES */}
        {expenses.length === 0 ? (
          <Card
            style={{
              padding: 20,
              borderRadius: 16,
              backgroundColor: "rgba(15, 23, 42, 0.9)",
            }}
          >
            <Text style={{ fontSize: 14, opacity: 0.8 }}>
              No expenses recorded yet.
            </Text>
          </Card>
        ) : (
          grouped.map(([date, list]) => (
            <View key={date} style={{ marginBottom: 24 }}>
              {/* DATE HEADER */}
              <Text
                style={{
                  fontSize: 16,
                  marginBottom: 10,
                  fontWeight: "600",
                  opacity: 0.8,
                }}
              >
                {formatDate(date)}
              </Text>

              <Card
                style={{
                  borderRadius: 18,
                  paddingVertical: 6,
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  borderWidth: 1,
                  borderColor: "rgba(148,163,184,0.25)",
                }}
              >
                {list.map((e, idx) => (
                  <TouchableOpacity
                    key={e.id}
                    onPress={() =>
                      router.push({
                        pathname: "/expense/[id]",
                        params: { id: e.id },
                      })
                    }
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 14,
                      borderBottomWidth:
                        idx === list.length - 1 ? 0 : 1,
                      borderBottomColor: "rgba(148,163,184,0.15)",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "600",
                          marginBottom: 2,
                        }}
                      >
                        {e.title}
                      </Text>
                      <Text style={{ fontSize: 12, opacity: 0.6 }}>
                        {e.category}
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "700",
                        color: "#F97316",
                      }}
                    >
                      {formatCurrency(e.amount)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Card>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
