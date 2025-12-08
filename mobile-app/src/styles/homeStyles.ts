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
    paddingTop: 32,   // 🔥 top padding – greeting visible
    paddingBottom: 40,
  },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
  },
  subGreeting: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },

  // CARD
 card: {
    paddingVertical: 28,   // 🔥 more top/bottom space
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
  cardTitle: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 8,
  },
expenseAmount: {
    color: "#F9FAFB",
    fontSize: 30,        // 🔥 smaller to avoid clipping
    lineHeight: 36,      // 🔥 ensures text never cuts
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
    marginTop: 4,    // 🔥 gives breathing room
},

  trendText: {
    fontSize: 12,
    color: "#E5E7EB",
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
  },

  // HABITS
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
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
});
