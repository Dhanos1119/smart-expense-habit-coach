// app/history.tsx
import React, { useMemo } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useExpenses } from "../src/context/ExpensesContext";
import { useTheme } from "../src/context/ThemeContext";
import { Text } from "react-native";

function formatCurrency(amount: number) {
  return `LKR ${amount.toLocaleString("en-LK")}`;
}

function formatDate(d: string) {
  return new Date(d).toDateString();
}

export default function HistoryPage() {
  const { expenses } = useExpenses();
  const { colors } = useTheme();

  /* GROUP BY DATE */
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* HEADER */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: colors.text,
            }}
          >
            Expense History
          </Text>

          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="arrow-back-circle"
              size={32}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* EMPTY STATE */}
        {expenses.length === 0 ? (
          <View
            style={{
              padding: 20,
              borderRadius: 16,
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ color: colors.subText }}>
              No expenses recorded yet.
            </Text>
          </View>
        ) : (
          grouped.map(([date, list]) => (
            <View key={date} style={{ marginBottom: 26 }}>
              {/* DATE HEADER */}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: colors.subText,
                  marginBottom: 10,
                }}
              >
                {formatDate(date)}
              </Text>

              {/* CARD */}
              <View
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: colors.border,
                  overflow: "hidden",
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
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      borderBottomWidth:
                        idx === list.length - 1 ? 0 : 1,
                      borderBottomColor: colors.border,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* LEFT */}
                    <View>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "600",
                          color: colors.text,
                        }}
                      >
                        {e.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          marginTop: 2,
                          color: colors.subText,
                        }}
                      >
                        {e.category}
                      </Text>
                    </View>

                    {/* AMOUNT */}
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "700",
                        color: colors.warning,
                      }}
                    >
                      {formatCurrency(e.amount)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
