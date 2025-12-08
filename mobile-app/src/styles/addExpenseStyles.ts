// src/styles/addExpenseStyles.ts
import { StyleSheet } from "react-native";

export const addExpenseStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
  },

  contentContainer: {
    padding: 20,
  },

  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 20,
  },

  fieldLabel: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 6,
    marginTop: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: "#1f2937",
    backgroundColor: "#111827",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },

  dateBox: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#1f2937",
    backgroundColor: "#111827",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginBottom: 12,
  },

  dateText: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
  },

  categoryBox: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#1f2937",
    backgroundColor: "#111827",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginBottom: 10,
  },

  categoryText: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#1f2937",
    backgroundColor: "#111827",
    borderRadius: 10,
    marginBottom: 20,
  },

  saveButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },

  saveButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },

  errorText: {
    color: "#f87171",
    marginBottom: 8,
  },
});
