// src/context/MonthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type MonthContextType = {
  selectedYear: number;
  selectedMonthIndex: number;
  setYear: (y: number) => void;
  setMonth: (m: number) => void;
};

const MonthContext = createContext<MonthContextType | undefined>(undefined);

export function MonthProvider({ children }: { children: ReactNode }) {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(now.getMonth());

  return (
    <MonthContext.Provider
      value={{
        selectedYear,
        selectedMonthIndex,
        setYear: setSelectedYear,
        setMonth: setSelectedMonthIndex,
      }}
    >
      {children}
    </MonthContext.Provider>
  );
}

export function useMonth() {
  const ctx = useContext(MonthContext);
  if (!ctx) throw new Error("useMonth must be used inside MonthProvider");
  return ctx;
}
