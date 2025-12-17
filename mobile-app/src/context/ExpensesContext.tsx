import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";

/* ---------------- TYPES ---------------- */
export type Expense = {
  id: string;
  amount: number;
  title: string;
  date: string; // YYYY-MM-DD
  category: string;
};

type ExpensesContextType = {
  expenses: Expense[];
  monthTotal: number;
  hydrated: boolean;
  addExpense: (e: Omit<Expense, "id">) => Promise<void>;
  updateExpense: (
    id: string,
    changes: Partial<Omit<Expense, "id">>
  ) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  clearAllExpenses: () => Promise<void>;
  monthlyBudget: number | null;
  setMonthlyBudget: (amount: number | null) => void;
};

const ExpensesContext = createContext<ExpensesContextType | undefined>(
  undefined
);

const STORAGE_KEY = "@my_expense_app__expenses";
const BUDGET_KEY = "@my_expense_app__budget";

/* ---------------- HELPERS ---------------- */
function getCurrentMonthTotal(expenses: Expense[]): number {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  return expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === y && d.getMonth() === m;
    })
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
}

/* =====================================================
   PROVIDER
   ===================================================== */
export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthTotal, setMonthTotal] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState<number | null>(null);

  /* ---------------------------------------------------
     1️⃣ LOAD FROM BACKEND (PRIMARY)
     --------------------------------------------------- */
  async function fetchExpensesFromApi() {
    try {
      const res = await api.get("/api/expenses");
      const data: Expense[] = res.data;

      setExpenses(data);
      setMonthTotal(getCurrentMonthTotal(data));

      // cache locally
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn("API failed, falling back to storage");
      loadFromStorage();
    } finally {
      setHydrated(true);
    }
  }

  /* ---------------------------------------------------
     2️⃣ FALLBACK: LOAD FROM ASYNC STORAGE
     --------------------------------------------------- */
  async function loadFromStorage() {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        const parsed: Expense[] = JSON.parse(json);
        setExpenses(parsed);
        setMonthTotal(getCurrentMonthTotal(parsed));
      }
    } catch (err) {
      console.warn("Failed to load expenses:", err);
    }
  }

  /* ---------------------------------------------------
     INITIAL LOAD
     --------------------------------------------------- */
  useEffect(() => {
    fetchExpensesFromApi();
  }, []);

  /* ---------------------------------------------------
     LOAD BUDGET
     --------------------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(BUDGET_KEY);
        if (stored != null) {
          const num = Number(stored);
          if (!isNaN(num) && num > 0) setMonthlyBudget(num);
        }
      } catch {}
    })();
  }, []);

  /* ---------------------------------------------------
     SAVE BUDGET
     --------------------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        if (monthlyBudget == null) {
          await AsyncStorage.removeItem(BUDGET_KEY);
        } else {
          await AsyncStorage.setItem(BUDGET_KEY, String(monthlyBudget));
        }
      } catch {}
    })();
  }, [monthlyBudget]);

  /* =====================================================
     CRUD OPERATIONS (API FIRST)
     ===================================================== */

  async function addExpense(e: Omit<Expense, "id">) {
    const res = await api.post("/api/expenses", e);
    const created: Expense = res.data;

    setExpenses((prev) => [created, ...prev]);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([created, ...expenses])
    );
  }

  async function updateExpense(
    id: string,
    changes: Partial<Omit<Expense, "id">>
  ) {
    const res = await api.put(`/api/expenses/${id}`, changes);
    const updated: Expense = res.data;

    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? updated : e))
    );
  }

  async function deleteExpense(id: string) {
    await api.delete(`/api/expenses/${id}`);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  async function clearAllExpenses() {
    await api.delete("/api/expenses");
    setExpenses([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  /* ---------------------------------------------------
     RE-CALCULATE MONTH TOTAL
     --------------------------------------------------- */
  useEffect(() => {
    setMonthTotal(getCurrentMonthTotal(expenses));
  }, [expenses]);

  /* ---------------------------------------------------
     CONTEXT VALUE
     --------------------------------------------------- */
  const value: ExpensesContextType = {
    expenses,
    monthTotal,
    hydrated,
    addExpense,
    updateExpense,
    deleteExpense,
    clearAllExpenses,
    monthlyBudget,
    setMonthlyBudget,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

/* =====================================================
   HOOK
   ===================================================== */
export function useExpenses() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) {
    throw new Error("useExpenses must be used within ExpensesProvider");
  }
  return ctx;
}
