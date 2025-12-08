// src/styles/analyticsStyles.ts
import { StyleSheet } from "react-native";

export const analyticsStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#020617",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F9FAFB",
  },
  subtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(34, 197, 94, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  // SUMMARY CARD
  summaryCard: {
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#0F172A",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.35)",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 26,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 6,
  },
  summaryHint: {
    fontSize: 11,
    color: "#6B7280",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F9FAFB",
    marginBottom: 12,
  },

  // CHART CARD
  chartCard: {
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.18)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  row: {
    marginBottom: 18,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  rowHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
  },

  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E5E7EB",
  },
  categoryAmount: {
    fontSize: 13,
    color: "#9CA3AF",
  },

  barBackground: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(31, 41, 55, 0.9)",
    overflow: "hidden",
    marginTop: 4,
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#22C55E",
  },

  percentPill: {
    alignSelf: "flex-end",
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "rgba(34, 197, 94, 0.12)",
    color: "#4ADE80",
    fontSize: 12,
    fontWeight: "600",
  },

  // EMPTY STATE
  emptyCard: {
    paddingVertical: 24,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.3)",
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 4,
  },
  emptySubText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
     pieCard: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  pieWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  legendWrapper: {
    marginTop: 16,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 13,
    color: "#E5E7EB",
  },
  percentLabel: {
  fontSize: 12,
  color: "#9CA3AF",
  width: 40,
  textAlign: "right",
},


});
