import { StyleSheet } from "react-native";

export const analyticsStyles = (colors: any) =>
  StyleSheet.create({
    /* ================= SCREEN ================= */

    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: {
      flex: 1,
    },

    contentContainer: {
      paddingHorizontal: 20,
      paddingTop: 32,
      paddingBottom: 40,
    },

    /* ================= HEADER ================= */

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },

    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
    },

    subtitle: {
      fontSize: 13,
      marginTop: 4,
      color: colors.subText,
    },

    headerIcon: {
      width: 42,
      height: 42,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },

    /* ================= SUMMARY ================= */

    summaryCard: {
      paddingVertical: 20,
      paddingHorizontal: 18,
      borderRadius: 20,
      marginBottom: 24,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },

    summaryLabel: {
      fontSize: 13,
      marginBottom: 4,
      color: colors.subText,
    },

    summaryAmount: {
      fontSize: 26,
      fontWeight: "700",
      marginBottom: 6,
      color: colors.text,
    },

    summaryHint: {
      fontSize: 11,
      color: colors.subText,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 12,
      color: colors.text,
    },

    /* ================= PIE ================= */

    pieCard: {
      borderRadius: 20,
      padding: 16,
      marginBottom: 24,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.text,
    },

    /* ================= CHART ================= */

    chartCard: {
      paddingVertical: 20,
      paddingHorizontal: 18,
      borderRadius: 24,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
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

    categoryName: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },

    categoryAmount: {
      fontSize: 13,
      color: colors.text,
    },

    barBackground: {
      height: 10,
      borderRadius: 999,
      overflow: "hidden",
      marginTop: 4,
      backgroundColor: colors.border,
    },

    barFill: {
      height: "100%",
      borderRadius: 999,
      backgroundColor: colors.primary,
    },

    percentLabel: {
      fontSize: 12,
      width: 40,
      textAlign: "right",
      color: colors.subText,
    },

    /* ================= EMPTY ================= */

    emptyCard: {
      paddingVertical: 24,
      paddingHorizontal: 18,
      borderRadius: 20,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },

    emptyText: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 4,
      color: colors.text,
    },

    emptySubText: {
      fontSize: 12,
      color: colors.subText,
    },
  });
