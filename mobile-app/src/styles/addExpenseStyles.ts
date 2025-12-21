import { StyleSheet } from "react-native";

export const addExpenseStyles = (colors: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background, // ✅
    },

    contentContainer: {
      padding: 20,
    },

    title: {
      fontSize: 24,
      color: colors.text, // ✅
      fontWeight: "700",
      marginBottom: 20,
    },

    fieldLabel: {
      color: colors.subText, // ✅
      fontSize: 14,
      marginBottom: 6,
      marginTop: 14,
    },

    input: {
      borderWidth: 1,
      borderColor: colors.border, // ✅
      backgroundColor: colors.card, // ✅
      color: colors.text, // ✅
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
    },

    dateBox: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: colors.border, // ✅
      backgroundColor: colors.card, // ✅
      borderRadius: 10,
      padding: 14,
      alignItems: "center",
      marginBottom: 12,
    },

    dateText: {
      flex: 1,
      color: colors.text, // ✅
      fontSize: 15,
    },

    categoryBox: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: colors.border, // ✅
      backgroundColor: colors.card, // ✅
      borderRadius: 10,
      padding: 14,
      alignItems: "center",
      marginBottom: 10,
    },

    categoryText: {
      flex: 1,
      color: colors.text, // ✅
      fontSize: 15,
    },

    pickerWrapper: {
      borderWidth: 1,
      borderColor: colors.border, // ✅
      backgroundColor: colors.card, // ✅
      borderRadius: 10,
      marginBottom: 20,
    },

    saveButton: {
      backgroundColor: colors.primary, // ✅
      paddingVertical: 16,
      borderRadius: 30,
      alignItems: "center",
      marginTop: 10,
    },

    saveButtonText: {
      color: colors.background, // ✅
      fontSize: 16,
      fontWeight: "700",
    },

    errorText: {
      color: colors.danger, // ✅
      marginBottom: 8,
    },
  });
