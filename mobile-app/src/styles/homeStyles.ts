import { StyleSheet, Platform, StatusBar } from "react-native";

const STATUS_BAR_HEIGHT = StatusBar.currentHeight ?? 0;

export const homeStyles = StyleSheet.create({
  // whole screen bg
  screen: {
    flex: 1,
    backgroundColor: "#000000", // pure black like iOS dark mode
  },

  // ScrollView style
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
  },

  // header at top
  header: {
    paddingTop:
      Platform.OS === "android" ? STATUS_BAR_HEIGHT + 8 : 16, // give space from notch
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#000000",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  subGreeting: {
    fontSize: 14,
    color: "#d1d5db",
    marginTop: 4,
  },
  profileButton: {
    position: "absolute",
    right: 20,
    top:
      Platform.OS === "android" ? STATUS_BAR_HEIGHT + 10 : 18,
    padding: 4,
  },

  // main card
card: {
  marginTop: 16,
  marginHorizontal: 20,
  paddingHorizontal: 26,
  paddingVertical: 28,  // 🔼 little more height inside
  borderRadius: 26,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 14,
  elevation: 6,
},

  expenseCard: {
    backgroundColor: "#1f2933",
  },
  cardTitle: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 8,
  },
expenseAmount: {
  color: "#ffffff",
  fontSize: 23,          // 🔽 slightly smaller
  fontWeight: "800",
  letterSpacing: 0.5,
  marginTop: 6,          // 🔼 push text down
  marginBottom: 14,
},

  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  trendText: {
    color: "#e5e7eb",
    fontSize: 12,
    marginLeft: 4,
  },

  // actions row
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 24,
  },
  actionButton: {
    alignItems: "center",
    flex: 1,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#e5e7eb",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#f9fafb",
    paddingHorizontal: 20,
  },

  habitsList: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  habitItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    marginBottom: 10,
  },
  habitIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f9fafb",
  },
  habitStreak: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#4b5563",
    justifyContent: "center",
    alignItems: "center",
  },
});
