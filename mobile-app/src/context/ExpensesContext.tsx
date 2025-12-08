// src/context/ExpensesContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Expense = {
  id: string;
  amount: number;
  title: string;
  date: string;     // "YYYY-MM-DD"
  category: string;
};

type ExpensesContextType = {
  expenses: Expense[];
  monthTotal: number;
  addExpense: (e: Omit<Expense, "id">) => void;
  // later: editExpense, deleteExpense, clearAll, etc.
};

const ExpensesContext = createContext<ExpensesContextType | undefined>(
  undefined
);

const STORAGE_KEY = "@my_expense_app__expenses";

function getCurrentMonthTotal(expenses: Expense[]): number {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  return expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === y && d.getMonth() === m;
    })
    .reduce((sum, e) => sum + e.amount, 0);
}

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthTotal, setMonthTotal] = useState(0);
  const [hydrated, setHydrated] = useState(false); // loaded from storage?

  // 🔹 1) Load from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const parsed: Expense[] = JSON.parse(json);
          setExpenses(parsed);
          setMonthTotal(getCurrentMonthTotal(parsed));
        }
      } catch (err) {
        console.warn("Failed to load expenses from storage:", err);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // 🔹 2) Whenever expenses change → save + recompute month total
  useEffect(() => {
    if (!hydrated) return; // avoid saving initial empty before load completes

    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
      } catch (err) {
        console.warn("Failed to save expenses:", err);
      }
    })();

    setMonthTotal(getCurrentMonthTotal(expenses));
  }, [expenses, hydrated]);

  // 🔹 3) Add new expense
  function addExpense(e: Omit<Expense, "id">) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setExpenses((prev) => [
      {
        id,
        ...e,
      },
      ...prev, // newest first
    ]);
  }

  const value: ExpensesContextType = {
    expenses,
    monthTotal,
    addExpense,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) {
    throw new Error("useExpenses must be used within an ExpensesProvider");
  }
  return ctx;
}
