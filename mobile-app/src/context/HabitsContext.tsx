import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "../api/api";
import { AuthContext } from "./AuthContext";

/* ================= TYPES ================= */
export type Habit = {
  id: number;
  title: string;
  icon: string;
  color: string;

  // ✅ BACKEND CALCULATED
  streak: number;
  completedToday: boolean;

  // 🔮 ML prediction
  ml?: {
    habitType: "STRONG" | "UNSTABLE" | "AT_RISK";
  };
};

type HabitsContextType = {
  habits: Habit[];
  loading: boolean;
  refreshHabits: () => Promise<void>;
  toggleHabitToday: (id: number) => Promise<void>;
  addHabit: (input: { title: string }) => Promise<void>;
  deleteHabit: (id: number) => Promise<void>;
};

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

/* ================= PROVIDER ================= */
export function HabitsProvider({ children }: { children: ReactNode }) {
  const { user } = useContext(AuthContext);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------- LOAD HABITS ---------- */
  async function refreshHabits() {
    if (!user) {
      setHabits([]);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/api/habits");

      // ✅ backend response is final truth
      setHabits(res.data);
    } catch (err) {
      console.error("❌ Failed to load habits", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshHabits();
  }, [user]);

  /* ---------- TOGGLE TODAY ---------- */
  async function toggleHabitToday(id: number) {
    try {
      const habit = habits.find((h) => h.id === id);
      if (!habit) return;

      // ✅ NO DATE / STREAK LOGIC HERE
      if (habit.completedToday) {
        await api.delete(`/api/habits/${id}/complete`);
      } else {
        await api.post(`/api/habits/${id}/complete`);
      }

      // 🔄 re-fetch from backend
      await refreshHabits();
    } catch (err) {
      console.error("❌ Toggle habit failed", err);
    }
  }

  /* ---------- ADD HABIT ---------- */
  async function addHabit(input: { title: string }) {
    const title = input.title.trim();
    if (!title) return;

    try {
      await api.post("/api/habits", { title });
      await refreshHabits();
    } catch (err) {
      console.error("❌ Add habit failed", err);
    }
  }

  /* ---------- DELETE HABIT ---------- */
  async function deleteHabit(id: number) {
    try {
      await api.delete(`/api/habits/${id}`);
      await refreshHabits();
    } catch (err) {
      console.error("❌ Delete habit failed", err);
    }
  }

  return (
    <HabitsContext.Provider
      value={{
        habits,
        loading,
        refreshHabits,
        toggleHabitToday,
        addHabit,
        deleteHabit,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
}

/* ================= HOOK ================= */
export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) {
    throw new Error("useHabits must be used inside HabitsProvider");
  }
  return ctx;
}
