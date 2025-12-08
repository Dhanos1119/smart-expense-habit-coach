// app/(tabs)/explore.tsx
import React, { useMemo } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { useExpenses } from "../../src/context/ExpensesContext";
import { Ionicons } from "@expo/vector-icons";
import Svg, { G, Path } from "react-native-svg";

import { ThemedText as Text } from "@/components/themed-text";
import { ThemedView as Card } from "@/components/themed-view";
import { analyticsStyles as styles } from "../../src/styles/analyticsStyles";

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-LK")}`;
}

// 🔹 Colors for categories
const chartColors = [
  "#60A5FA", // blue
  "#F472B6", // pink
  "#34D399", // green
  "#FACC15", // yellow
  "#F87171", // red
];

// 🔹 Helper: build arc path (pie slice)
function buildPieSlicePath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
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

    const arr = Array.from(map.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    return { categoryTotals: arr, monthTotal: total };
  }, [monthExpenses]);

  const hasData = categoryTotals.length > 0;

  // 3) Build pie slices (angles + paths)
  const PIE_SIZE = 180;
  const RADIUS = PIE_SIZE / 2 - 4;

  const pieSlices = useMemo(() => {
    if (!hasData || monthTotal <= 0) return [];

    let startAngle = -Math.PI / 2; // start from top (12 o'clock)
    return categoryTotals.map((item, index) => {
      const fraction = item.amount / monthTotal;
      const sliceAngle = fraction * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;
      const path = buildPieSlicePath(
        PIE_SIZE / 2,
        PIE_SIZE / 2,
        RADIUS,
        startAngle,
        endAngle
      );
      const color = chartColors[index % chartColors.length];
      startAngle = endAngle;
      return { ...item, path, color };
    });
  }, [categoryTotals, monthTotal, hasData]);

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

        {/* PIE CHART SECTION */}
        {hasData && (
          <>
            <Text style={styles.sectionTitle}>Spending breakdown</Text>

            <Card style={styles.pieCard}>
              <View style={styles.pieWrapper}>
                <Svg width={PIE_SIZE} height={PIE_SIZE}>
                  <G>
                    {pieSlices.map((slice) => (
                      <Path
                        key={slice.category}
                        d={slice.path}
                        fill={slice.color}
                      />
                    ))}
                  </G>
                </Svg>
              </View>

              {/* Legend */}
              <View style={styles.legendWrapper}>
                {pieSlices.map((slice) => {
                  const pct =
                    monthTotal > 0
                      ? Math.round((slice.amount / monthTotal) * 100)
                      : 0;
                  return (
                    <View
                      key={slice.category}
                      style={styles.legendRow}
                    >
                      <View
                        style={[
                          styles.legendDot,
                          { backgroundColor: slice.color },
                        ]}
                      />
                      <Text style={styles.legendLabel}>
                        {slice.category} — {pct}%
                      </Text>
                    </View>
                  );
                })}
              </View>
            </Card>
          </>
        )}

        {/* CATEGORY LIST / BAR CHART */}
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
                  <View style={styles.rowHeader}>
                    <Text style={styles.categoryName}>{item.category}</Text>
                    <Text style={styles.categoryAmount}>
                      {formatCurrency(item.amount, "LKR")}
                    </Text>
                  </View>

                  <View style={styles.barBackground}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${Math.max(pct, 4)}%` },
                      ]}
                    />
                  </View>

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
