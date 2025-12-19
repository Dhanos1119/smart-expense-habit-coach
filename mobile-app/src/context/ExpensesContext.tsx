import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../api/api";
import { AuthContext } from "./AuthContext";

/* ================= TYPES ================= */

export type Expense = {
  id: number;
  amount: number;
  currency?: string;
  title: string;
  category: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
};

type AddExpensePayload = {
  amount: number;
  title: string;
  category: string;
  date: string;
};

type ExpensesContextType = {
  expenses: Expense[];
  loading: boolean;

  monthTotal: number;

  // ✅ budget
  monthlyBudget: number | null;
  setMonthlyBudget: (v: number) => void;

  fetchExpenses: () => Promise<void>;
  addExpense: (payload: AddExpensePayload) => Promise<void>;
  clearAllExpenses: () => Promise<void>;
  fetchMonthlyBudget: () => Promise<void>;

};

/* ================= CONTEXT ================= */

export const ExpensesContext =
  createContext<ExpensesContextType | null>(null);

/* ================= PROVIDER ================= */

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const { token } = useContext(AuthContext);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState<number | null>(null);

  /* ================= FETCH ================= */

  const fetchExpenses = async () => {
    if (!token) return;

    try {
      setLoading(true);

      /* ---------- 1️⃣ FETCH EXPENSES ---------- */
      const expRes = await api.get("/api/expenses");

      const normalized: Expense[] = (expRes.data || []).map((e: any) => ({
        id: e.id,
        amount: Number(e.amount),
        currency: e.currency ?? "LKR",
        title: e.note ?? "",
        category: e.category && e.category.trim() !== "" ? e.category : "Other",
        date: e.date
          ? e.date.slice(0, 10)
          : e.createdAt.slice(0, 10),
        createdAt: e.createdAt,
      }));

      setExpenses(normalized);

      /* ---------- 2️⃣ FETCH USER BUDGET ---------- */
      const userRes = await api.get("/api/users/me");

      if (
        userRes.data &&
        typeof userRes.data.monthlyBudget === "number"
      ) {
        setMonthlyBudget(userRes.data.monthlyBudget);
      } else {
        setMonthlyBudget(null);
      }
    } catch (e) {
      console.warn("Fetch expenses / budget failed", e);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD EXPENSE ================= */

  const addExpense = async (payload: AddExpensePayload) => {
    if (!token) throw new Error("Not authenticated");

    const res = await api.post("/api/expenses", {
      amount: payload.amount,
      note: payload.title,
      category:
        payload.category && payload.category.trim() !== ""
          ? payload.category
          : "Other",
      date: payload.date,
    });

    const saved: Expense = {
      id: res.data.id,
      amount: Number(res.data.amount),
      currency: res.data.currency ?? "LKR",
      title: res.data.note ?? "",
      category:
        res.data.category && res.data.category.trim() !== ""
          ? res.data.category
          : "Other",
      date: res.data.date
        ? res.data.date.slice(0, 10)
        : res.data.createdAt.slice(0, 10),
      createdAt: res.data.createdAt,
    };

    setExpenses((prev) => [saved, ...prev]);
  };

  const fetchMonthlyBudget = async () => {
  if (!token) return;

  try {
    const res = await api.get("/api/user/budget");
    setMonthlyBudget(res.data?.monthlyBudget ?? null);
  } catch (e) {
    console.warn("Fetch budget failed", e);
  }
};


  /* ================= CLEAR ================= */

  const clearAllExpenses = async () => {
    setExpenses([]);
  };

  /* ================= AUTO LOAD ON LOGIN ================= */

useEffect(() => {
  if (!token) {
    setExpenses([]);
    setMonthlyBudget(null);
    return;
  }

  (async () => {
    try {
      setLoading(true);

      // 🔥 Sequential – token header guaranteed
      await fetchExpenses();
      await fetchMonthlyBudget();

    } catch (err) {
      console.warn("Failed to load expense data on token restore", err);
    } finally {
      setLoading(false);
    }
  })();
}, [token]);


  /* ================= TOTAL ================= */

  const monthTotal = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  return (
    <ExpensesContext.Provider
     value={{
  expenses,
  loading,
  monthTotal,
  monthlyBudget,
  setMonthlyBudget,
  fetchExpenses,
  fetchMonthlyBudget,
  addExpense,
  clearAllExpenses,
}}

    >
      {children}
    </ExpensesContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useExpenses() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) {
    throw new Error("useExpenses must be used inside ExpensesProvider");
  }
  return ctx;
}
