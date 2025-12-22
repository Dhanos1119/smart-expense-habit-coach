import React from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MlBadge from "@/components/MlBadge";
import { useHabits } from "@/src/context/HabitsContext";

/* ================= TYPES ================= */
export type Habit = {
  id: number;
  title: string;
  icon: string;
  color: string;
  streak: number;
  completedToday: boolean;
  ml?: {
    habitType: "STRONG" | "UNSTABLE" | "AT_RISK";
  };
};

type Props = {
  habit: Habit;
};

/* ================= COMPONENT ================= */
export default function HabitCard({ habit }: Props) {
  const { toggleHabitToday, deleteHabit } = useHabits();

  const completedToday = habit.completedToday;

  return (
    <Pressable
      onPress={() => toggleHabitToday(habit.id)}
      onLongPress={() =>
        Alert.alert(
          "Delete habit?",
          `Are you sure you want to delete "${habit.title}"?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => deleteHabit(habit.id),
            },
          ]
        )
      }
      style={styles.card}
    >
      <View style={styles.row}>
        {/* LEFT ICON */}
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: completedToday ? habit.color : "#111827" },
          ]}
        >
          <Ionicons
            name={habit.icon as any}
            size={18}
            color="#fff"
          />
        </View>

        {/* TITLE + STREAK + ML */}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{habit.title}</Text>

          <Text style={styles.streak}>
            {habit.streak} day{habit.streak === 1 ? "" : "s"} streak{" "}
            {completedToday ? "🔥" : ""}
          </Text>

          {/* ✅ ML BADGE */}
          {habit.ml?.habitType && (
            <MlBadge type={habit.ml.habitType} />
          )}
        </View>

        {/* CHECKBOX */}
        <View
          style={[
            styles.checkbox,
            completedToday && {
              backgroundColor: "#22C55E",
              borderColor: "#22C55E",
            },
          ]}
        >
          {completedToday && (
            <Ionicons name="checkmark" size={16} color="#fff" />
          )}
        </View>
      </View>
    </Pressable>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0B0F1A",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  streak: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#374151",
    alignItems: "center",
    justifyContent: "center",
  },
});
