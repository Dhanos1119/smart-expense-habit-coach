// app/explore.tsx
import React, { useMemo } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { useExpenses } from "../../src/context/ExpensesContext";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText as Text } from "@/components/themed-text";
import { ThemedView as Card } from "@/components/themed-view";
import { analyticsStyles as styles } from "../../src/styles/analyticsStyles";

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-LK")}`;
}

export default function AnalyticsPage() {
  const { expenses } = useExpenses();

  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth(); // 0–11

  // 1) Filter this month's expenses
  const monthExpenses = useMemo(
    () =>
      expenses.filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === thisYear && d.getMonth() === thisMonth;
      }),
    [expenses, thisYear, thisMonth]
  );

  // 2) Group by category
  const { categoryTotals, monthTotal } = useMemo(() => {
    const map = new Map<string, number>();
    let total = 0;

    for (const e of monthExpenses) {
      total += e.amount;
      const prev = map.get(e.category) || 0;
      map.set(e.category, prev + e.amount);
    }

    // convert to array & sort desc
    const arr = Array.from(map.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    return { categoryTotals: arr, monthTotal: total };
  }, [monthExpenses]);

  const hasData = categoryTotals.length > 0;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Spending Analytics</Text>
            <Text style={styles.subtitle}>
              Category breakdown for this month
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons name="stats-chart" size={24} color="#22C55E" />
          </View>
        </View>

        {/* SUMMARY CARD */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total this month</Text>
          <Text style={styles.summaryAmount}>
            {formatCurrency(monthTotal, "LKR")}
          </Text>
          <Text style={styles.summaryHint}>
            Tap “Add Expense” on Home to update these numbers.
          </Text>
        </Card>

        {/* CATEGORY CHART */}
        <Text style={styles.sectionTitle}>By category</Text>

        {!hasData ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No expenses recorded this month yet.
            </Text>
            <Text style={styles.emptySubText}>
              Add some expenses to see your category chart.
            </Text>
          </Card>
        ) : (
          <Card style={styles.chartCard}>
            {categoryTotals.map((item) => {
              const pct =
                monthTotal > 0
                  ? Math.round((item.amount / monthTotal) * 100)
                  : 0;

              return (
                <View key={item.category} style={styles.row}>
                  {/* left: category + amount */}
                  <View style={styles.rowHeader}>
                    <Text style={styles.categoryName}>{item.category}</Text>
                    <Text style={styles.categoryAmount}>
                      {formatCurrency(item.amount, "LKR")}
                    </Text>
                  </View>

                  {/* middle: bar */}
                  <View style={styles.barBackground}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${Math.max(pct, 4)}%` }, // min width to be visible
                      ]}
                    />
                  </View>

                  {/* right: percentage */}
                  <Text style={styles.percentLabel}>{pct}%</Text>
                </View>
              );
            })}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
