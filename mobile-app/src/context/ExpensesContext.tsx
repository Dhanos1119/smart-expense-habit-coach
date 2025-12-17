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
  title: string;        // frontend name
  category: string;
  date: string;         // YYYY-MM-DD
  createdAt: string;
};

type AddExpensePayload = {
  amount: number;
  title: string;        // UI uses title
  category: string;
  date: string;
};

type ExpensesContextType = {
  expenses: Expense[];
  loading: boolean;

  // totals
  monthTotal: number;

  // budget
  monthlyBudget: number | null;
  setMonthlyBudget: (v: number) => void;

  // actions
  fetchExpenses: () => Promise<void>;
  addExpense: (payload: AddExpensePayload) => Promise<void>;
  clearAllExpenses: () => Promise<void>;
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
      const res = await api.get("/api/expenses");

      // 🔥 normalize backend → frontend shape
      const normalized: Expense[] = (res.data || []).map((e: any) => ({
        id: e.id,
        amount: e.amount,
        currency: e.currency ?? "LKR",
        title: e.note ?? "",                 // backend note → frontend title
        category: e.category ?? "Other",
        date: e.date ?? e.createdAt.slice(0, 10),
        createdAt: e.createdAt,
      }));

      setExpenses(normalized);
    } catch (e) {
      console.warn("Fetch expenses failed", e);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD ================= */

  const addExpense = async (payload: AddExpensePayload) => {
    if (!token) throw new Error("Not authenticated");

    try {
      // 🔥 IMPORTANT: map title → note
      const res = await api.post("/api/expenses", {
        amount: payload.amount,
        note: payload.title,                     // ✅ FIX
        category:
          payload.category && payload.category.trim() !== ""
            ? payload.category
            : "Other",
        date: payload.date,
      });

      // 🔥 normalize response
      const saved: Expense = {
        id: res.data.id,
        amount: res.data.amount,
        currency: res.data.currency ?? "LKR",
        title: res.data.note ?? "",
        category: res.data.category ?? "Other",
        date: res.data.date ?? res.data.createdAt.slice(0, 10),
        createdAt: res.data.createdAt,
      };

      // instant UI update
      setExpenses((prev) => [saved, ...prev]);
    } catch (e) {
      console.warn("Add expense failed", e);
      throw e;
    }
  };

  /* ================= CLEAR ALL ================= */

  const clearAllExpenses = async () => {
    if (!token) return;

    try {
      // backend delete-all route illa na
      setExpenses([]);
    } catch (e) {
      console.warn("Clear expenses failed", e);
    }
  };

  /* ================= AUTO LOAD ================= */

  useEffect(() => {
    if (token) {
      fetchExpenses();
    } else {
      setExpenses([]);
    }
  }, [token]);

  /* ================= DERIVED TOTALS ================= */

  const monthTotal = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        loading,
        monthTotal,
        monthlyBudget,
        setMonthlyBudget,
        fetchExpenses,
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
