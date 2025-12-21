// src/styles/homeStyles.ts
import { StyleSheet } from "react-native";

export const createHomeStyles = (colors: any) =>
  StyleSheet.create({
    /* SCREEN */
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    contentContainer: {
      paddingHorizontal: 20,
      paddingTop: 32,
      paddingBottom: 40,
    },

    /* HEADER */
    header: {
      marginBottom: 24,
      marginTop: 10,
    },
    greeting: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
    },
    subGreeting: {
      fontSize: 14,
      marginTop: 4,
      color: colors.subText,
    },

    /* CARD */
    card: {
      paddingVertical: 28,
      paddingHorizontal: 20,
      borderRadius: 24,
      marginBottom: 24,
      backgroundColor: colors.card,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },

    expenseCard: {
      backgroundColor: colors.card,
      zIndex: 1,     
    },

    cardTitle: {
      color: colors.subText,
      fontSize: 14,
    },
    cardSubtitle: {
      color: colors.subText,
      fontSize: 13,
      marginTop: -4,
    },

    expenseAmount: {
      color: colors.text,
      fontSize: 30,
      lineHeight: 36,
      fontWeight: "700",
      marginBottom: 12,
    },

    /* QUICK ACTIONS */
    actionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 32,
       zIndex: 50,  
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
      color: colors.text,
    },

    /* SECTION TITLE */
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 16,
      color: colors.text,
    },

    /* HABITS */
    habitsList: {
      gap: 12,
    },
    habitItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 20,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.text,
    },
    habitStreak: {
      fontSize: 12,
      color: colors.subText,
      marginTop: 2,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },

    /* RECENT EXPENSES */
    recentCard: {
      marginBottom: 24,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 20,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    recentRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    recentLeft: {
      flex: 1,
      marginRight: 12,
    },
    recentTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    recentMeta: {
      fontSize: 11,
      color: colors.subText,
      marginTop: 2,
    },
    recentAmount: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
    },
    recentEmptyText: {
      fontSize: 12,
      color: colors.subText,
    },
  });
