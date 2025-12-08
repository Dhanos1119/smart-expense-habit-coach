// src/context/HabitsContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Habit = {
  id: string;
  title: string;
  icon: string; // Ionicons name
  color: string;
  streak: number;
  lastCompletedDate: string | null; // "YYYY-MM-DD"
};

type HabitsContextType = {
  habits: Habit[];
  toggleHabitToday: (id: string) => void;
  addHabit: (input: { title: string }) => void;
  deleteHabit: (id: string) => void;
};

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

const HABITS_KEY = "@my_expense_app__habits";

// 🔧 DEV TESTING DATE OVERRIDE (streak test-ku only)
// null => real device date use aagum
// Example test panna: const DEV_OVERRIDE_DATE = "2025-01-10";
const DEV_OVERRIDE_DATE: string | null = "2025-01-16";

function todayStr() {
  if (DEV_OVERRIDE_DATE) {
    return DEV_OVERRIDE_DATE;
  }
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);

  // 🔹 Load from storage once
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(HABITS_KEY);
        if (json) {
          const parsed = JSON.parse(json) as Habit[];

          // safety: old data-la field missing na default values set pannrom
          const fixed = parsed.map((h) => ({
            id: h.id,
            title: h.title,
            icon: h.icon || "checkmark-circle",
            color: h.color || "#22C55E",
            streak: typeof h.streak === "number" ? h.streak : 0,
            lastCompletedDate:
              typeof h.lastCompletedDate === "string"
                ? h.lastCompletedDate
                : null,
          }));

          setHabits(fixed);
        } else {
          const initial: Habit[] = [
            {
              id: "1",
              title: "No outside food",
              icon: "restaurant",
              color: "#FF9800",
              streak: 0,
              lastCompletedDate: null,
            },
            {
              id: "2",
              title: "Track every expense",
              icon: "create",
              color: "#2196F3",
              streak: 0,
              lastCompletedDate: null,
            },
            {
              id: "3",
              title: "No impulse buys",
              icon: "flash",
              color: "#4CAF50",
              streak: 0,
              lastCompletedDate: null,
            },
          ];
          setHabits(initial);
          await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(initial));
        }
      } catch (err) {
        console.warn("Failed to load habits:", err);
      }
    })();
  }, []);

  // 🔹 Save whenever habits change
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
      } catch (err) {
        console.warn("Failed to save habits:", err);
      }
    })();
  }, [habits]);

  // ✅ Toggle logic (supports 0 → 1 → 0 on same day)
function toggleHabitToday(id: string) {
  const today = todayStr();

  setHabits((prev) =>
    prev.map((h) => {
      if (h.id !== id) return h;

      // same-day un-tick
      if (h.lastCompletedDate === today) {
        return {
          ...h,
          lastCompletedDate: null,
          streak: 0,
        };
      }

      let newStreak: number;

      if (!h.lastCompletedDate) {
        newStreak = 1;
      } else {
        const t = new Date(today); // use today (may be DEV_OVERRIDE_DATE)
        t.setDate(t.getDate() - 1);
        const yStr = t.toISOString().slice(0, 10);

        if (h.lastCompletedDate === yStr) {
          newStreak = h.streak + 1;
        } else {
          newStreak = 1;
        }
      }

      return {
        ...h,
        streak: newStreak,
        lastCompletedDate: today,
      };
    })
  );
}

  // ✅ Add new habit
  function addHabit(input: { title: string }) {
    const trimmed = input.title.trim();
    if (!trimmed) return;

    const defaultColors = ["#22C55E", "#3B82F6", "#F97316", "#A855F7"];
    const defaultIcons = ["checkmark-circle", "flash", "heart", "sparkles"];

    const index = habits.length;
    const color = defaultColors[index % defaultColors.length];
    const icon = defaultIcons[index % defaultIcons.length];

    const newHabit: Habit = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: trimmed,
      icon,
      color,
      streak: 0,
      lastCompletedDate: null,
    };

    setHabits((prev) => [newHabit, ...prev]);
  }

  // ✅ Delete habit
  function deleteHabit(id: string) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  const value: HabitsContextType = {
    habits,
    toggleHabitToday,
    addHabit,
    deleteHabit,
  };

  return (
    <HabitsContext.Provider value={value}>
      {children}
    </HabitsContext.Provider>
  );
}

// 🔚 Hook
export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used within HabitsProvider");
  return ctx;
}
