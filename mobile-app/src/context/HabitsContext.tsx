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
  streak: number;
  lastCompletedDate: string | null; // YYYY-MM-DD
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

  /* ---------- LOAD FROM BACKEND ---------- */
  async function refreshHabits() {
    if (!user) {
      setHabits([]);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/api/habits");
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

  /* ---------- TOGGLE (COMPLETE TODAY) ---------- */
async function toggleHabitToday(id: number) {
  try {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    // 🔥 If already completed today → UNDO
    if (habit.lastCompletedDate) {
      await api.delete(`/api/habits/${id}/complete`);
    } 
    // 🔥 Else → COMPLETE
    else {
      await api.post(`/api/habits/${id}/complete`);
    }

    await refreshHabits();
  } catch (err) {
    console.error("❌ Toggle habit failed", err);
  }
}


  /* ---------- ADD ---------- */
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

  /* ---------- DELETE ---------- */
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
