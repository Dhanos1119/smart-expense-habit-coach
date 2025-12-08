// src/context/ExpensesContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Expense = {
  id: string;
  amount: number;
  title: string;
  date: string;      // "YYYY-MM-DD"
  category: string;
};

type ExpensesContextValue = {
  expenses: Expense[];
  addExpense: (e: Omit<Expense, "id">) => void;
  clearAll: () => void;
  monthTotal: number;
};

const ExpensesContext = createContext<ExpensesContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "@smart-expense-habit/expenses";

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loaded, setLoaded] = useState(false);

  // load once
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: Expense[] = JSON.parse(raw);
          setExpenses(parsed);
        }
      } catch (err) {
        console.warn("Failed to load expenses:", err);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // save whenever expenses change (after first load)
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses)).catch((err) =>
      console.warn("Failed to save expenses:", err)
    );
  }, [expenses, loaded]);

  function addExpense(e: Omit<Expense, "id">) {
    const newExpense: Expense = {
      id: Date.now().toString(),
      ...e,
    };
    setExpenses((prev) => [newExpense, ...prev]);
  }

  function clearAll() {
    setExpenses([]);
  }

  // current month total
  const monthTotal = useMemo(() => {
    if (!expenses.length) return 0;
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();

    return expenses
      .filter((exp) => {
        const d = new Date(exp.date);
        return d.getFullYear() === y && d.getMonth() === m;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const value: ExpensesContextValue = {
    expenses,
    addExpense,
    clearAll,
    monthTotal,
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
    throw new Error("useExpenses must be used inside <ExpensesProvider />");
  }
  return ctx;
}
