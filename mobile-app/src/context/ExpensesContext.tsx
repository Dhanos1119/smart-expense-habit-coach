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
  date: string; // "YYYY-MM-DD"
  category: string;
};

type ExpensesContextType = {
  expenses: Expense[];
  monthTotal: number;
  hydrated: boolean;
  addExpense: (e: Omit<Expense, "id">) => void;
  updateExpense: (
    id: string,
    changes: Partial<Omit<Expense, "id">>
  ) => void;
  deleteExpense: (id: string) => void;
  clearAllExpenses: () => void;
  monthlyBudget: number | null;
  setMonthlyBudget: (amount: number | null) => void;
};

const ExpensesContext = createContext<ExpensesContextType | undefined>(
  undefined
);

const STORAGE_KEY = "@my_expense_app__expenses";
const BUDGET_KEY = "@my_expense_app__budget";

// ---------------------------------------------
// MONTH TOTAL
// ---------------------------------------------
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

// ---------------------------------------------
// PROVIDER
// ---------------------------------------------
export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthTotal, setMonthTotal] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const [monthlyBudget, setMonthlyBudget] = useState<number | null>(null);

  // ---------------------------------------------
  // LOAD FROM STORAGE (expenses)
  // ---------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const raw = JSON.parse(json);

          const parsed: Expense[] = raw.map((e: any) => ({
            ...e,
            amount: Number(e.amount),
          }));

          setExpenses(parsed);
          setMonthTotal(getCurrentMonthTotal(parsed));
        }
      } catch (err) {
        console.warn("Failed to load expenses:", err);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // ---------------------------------------------
  // LOAD BUDGET FROM STORAGE
  // ---------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(BUDGET_KEY);
        if (stored != null) {
          const num = Number(stored);
          if (!isNaN(num) && num > 0) setMonthlyBudget(num);
        }
      } catch (err) {
        console.warn("Failed to load budget:", err);
      }
    })();
  }, []);

  // ---------------------------------------------
  // SAVE EXPENSES WHEN THEY CHANGE
  // ---------------------------------------------
  useEffect(() => {
    if (!hydrated) return;

    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
      } catch (err) {
        console.warn("Failed to save expenses:", err);
      }
    })();

    setMonthTotal(getCurrentMonthTotal(expenses));
  }, [expenses, hydrated]);

  // ---------------------------------------------
  // SAVE BUDGET WHEN IT CHANGES
  // ---------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        if (monthlyBudget == null) {
          await AsyncStorage.removeItem(BUDGET_KEY);
        } else {
          await AsyncStorage.setItem(BUDGET_KEY, String(monthlyBudget));
        }
      } catch (err) {
        console.warn("Failed to save budget:", err);
      }
    })();
  }, [monthlyBudget]);

  // ---------------------------------------------
  // ADD EXPENSE (duplicate guard)
  // ---------------------------------------------
  function addExpense(e: Omit<Expense, "id">) {
    setExpenses((prev) => {
      const last = prev[0];

      if (
        last &&
        last.amount === e.amount &&
        last.title === e.title &&
        last.date === e.date &&
        last.category === e.category
      ) {
        console.log("Duplicate add blocked:", e);
        return prev;
      }

      const id = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

      return [{ id, ...e }, ...prev];
    });
  }

  // ---------------------------------------------
  // UPDATE EXPENSE
  // ---------------------------------------------
  function updateExpense(
    id: string,
    changes: Partial<Omit<Expense, "id">>
  ) {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, ...changes } : exp))
    );
  }

  // ---------------------------------------------
  // DELETE EXPENSE
  // ---------------------------------------------
  function deleteExpense(id: string) {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  }

  // ---------------------------------------------
  // CLEAR ALL EXPENSES
  // ---------------------------------------------
  function clearAllExpenses() {
    setExpenses([]);
    AsyncStorage.removeItem(STORAGE_KEY).catch((err) =>
      console.warn("Failed to clear storage:", err)
    );
  }

  // ---------------------------------------------
  // CONTEXT VALUE
  // ---------------------------------------------
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

// ---------------------------------------------
// HOOK
// ---------------------------------------------
export function useExpenses() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) {
    throw new Error("useExpenses must be used within an ExpensesProvider");
  }
  return ctx;
}
