// src/styles/addExpenseStyles.ts
import { StyleSheet } from "react-native";

export const addExpenseStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f9fafb",
    marginTop: 16,
    marginBottom: 12,
  },

  fieldLabel: {
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 6,
  },

  // text input + mic button row
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  inputFlex: {
    flex: 1,
  },

  input: {
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#e5e7eb",
    fontSize: 15,
    backgroundColor: "#020617",
  },

  voiceButton: {
    marginLeft: 8,
    width: 38,
    height: 38,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1f2937",
    backgroundColor: "#020617",
    alignItems: "center",
    justifyContent: "center",
  },

  // date display box (press to open picker)
  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#020617",
    marginBottom: 14,
  },
  dateText: {
    flex: 1,
    color: "#e5e7eb",
    fontSize: 15,
  },
  datePlaceholder: {
    color: "#6b7280",
  },

  // category dropdown
  categoryBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#020617",
    marginBottom: 8,
  },
  categoryText: {
    flex: 1,
    color: "#e5e7eb",
    fontSize: 15,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
    backgroundColor: "#020617",
  },

  saveButton: {
    marginTop: 12,
    backgroundColor: "#38bdf8", // 🔵 new colour
    paddingVertical: 13,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#020617",
    fontSize: 16,
    fontWeight: "700",
  },

  errorText: {
    color: "#f97373",
    marginBottom: 8,
    fontSize: 13,
  },

  voiceHint: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 10,
  },
});
