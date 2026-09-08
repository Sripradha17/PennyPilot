import { createContext, useContext, useMemo, useState } from "react";
import { monthKey, monthLabel, shiftMonth, isSameMonth } from "../lib/month.js";

const MonthContext = createContext(null);

export function MonthProvider({ children }) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const value = useMemo(
    () => ({
      selectedMonth,
      key: monthKey(selectedMonth),
      label: monthLabel(selectedMonth),
      isCurrentMonth: isSameMonth(selectedMonth, new Date()),
      goToPrevMonth: () => setSelectedMonth((m) => shiftMonth(m, -1)),
      goToNextMonth: () => setSelectedMonth((m) => shiftMonth(m, 1)),
      goToCurrentMonth: () => {
        const now = new Date();
        setSelectedMonth(new Date(now.getFullYear(), now.getMonth(), 1));
      },
    }),
    [selectedMonth]
  );

  return <MonthContext.Provider value={value}>{children}</MonthContext.Provider>;
}

export function useMonth() {
  const ctx = useContext(MonthContext);
  if (!ctx) throw new Error("useMonth must be used within MonthProvider");
  return ctx;
}
