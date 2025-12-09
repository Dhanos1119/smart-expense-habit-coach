// src/styles/homeStyles.ts
import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  // full-screen background + safe area
  screen: {
    flex: 1,
    backgroundColor: "#020617", // dark navy
  },

  container: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 32, // greeting visible
    paddingBottom: 40,
  },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F9FAFB",
  },
  subGreeting: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
    color: "#9CA3AF",
  },
  profileButton: {
    padding: 4,
  },

  // CARD
  card: {
    paddingVertical: 28, // more top/bottom space
    paddingHorizontal: 20,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },

  expenseCard: {
    backgroundColor: "#111827",
  },

  // row: title + filter chips
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  cardTitle: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 0,
  },
  cardSubtitle: {
  color: "#94A3B8",   // light gray
  fontSize: 13,
  marginTop: -4,
},


  expenseAmount: {
    color: "#F9FAFB",
    fontSize: 30, // smaller to avoid clipping
    lineHeight: 36, // ensures text never cuts
    fontWeight: "700",
    marginBottom: 12,
  },

  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(148, 163, 184, 0.18)",
    gap: 4,
    marginTop: 4, // gives breathing room
  },

  trendText: {
    fontSize: 12,
    color: "#E5E7EB",
  },

  // FILTER CHIPS (This month / All time)
  filterRow: {
    flexDirection: "row",
    columnGap: 6,
  },

  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4B5563",
  },

  filterChipActive: {
    backgroundColor: "#22c55e22",
    borderColor: "#22C55E",
  },

  filterChipText: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  filterChipTextActive: {
    color: "#E5E7EB",
    fontWeight: "600",
  },

  // QUICK ACTIONS
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  actionButton: {
    alignItems: "center",
    flex: 1,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#E5E7EB",
  },

  // HABITS
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#F9FAFB",
  },
  habitsList: {
    gap: 12,
  },
  habitItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.25)",
    marginBottom: 10,
  },
  habitIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F9FAFB",
  },
  habitStreak: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#4B5563",
    justifyContent: "center",
    alignItems: "center",
  },
   // RECENT EXPENSES
  recentCard: {
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.25)",
  },
  recentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(15, 23, 42, 0.9)",
  },
  recentLeft: {
    flex: 1,
    marginRight: 12,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F9FAFB",
  },
  recentMeta: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },
  recentAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F97316",
  },
  recentEmptyText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
     // BUDGET CARD
  budgetCard: {
    backgroundColor: "#0F172A",
    marginBottom: 24,
  },
  budgetHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  // 🔥 UPDATED: SUPER VISIBLE BRIGHT WHITE LABEL
  budgetLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF", // changed from #9CA3AF → NOW FULL WHITE
  },

  budgetAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F9FAFB",
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  budgetSmall: {
    fontSize: 12,
    color: "#E5E7EB",
  },
  budgetProgressBg: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(31,41,55,0.9)",
    overflow: "hidden",
    marginTop: 10,
  },
  budgetProgressFill: {
    height: "100%",
    borderRadius: 999,
  },
  budgetWarning: {
    marginTop: 6,
    fontSize: 11,
    color: "#F97316",
  },
  budgetInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    columnGap: 8,
  },
  budgetInput: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
    fontSize: 13,
    color: "#fff", // the typed text also visible
  },
  budgetSaveButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#22C55E",
  },
  budgetSaveText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0F172A",
  },


});
