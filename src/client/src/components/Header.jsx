import { Wallet } from "lucide-react";
import MonthNavigator from "./MonthNavigator.jsx";
import { useData } from "../context/DataContext.jsx";
import { useMonth } from "../context/MonthContext.jsx";
import { monthKey } from "../lib/month.js";

export default function Header() {
  const { expenses, income, settings } = useData();
  const { key } = useMonth();

  const monthExpenses = expenses.filter((e) => monthKey(new Date(e.date)) === key);
  const monthIncome = income.filter((i) => monthKey(new Date(i.date)) === key);

  const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = monthIncome.reduce((sum, i) => sum + i.amount, 0);
  const fmt = (n) => `${settings.currency}${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  return (
    <header className="sticky top-0 z-20 bg-surface text-ink shadow-soft border-b border-mist">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Wallet size={26} className="shrink-0" />
          <span className="font-display font-extrabold text-xl tracking-tight">PennyPilot</span>
        </div>
        <MonthNavigator />
        <div className="flex gap-4 text-sm">
          <Stat label="Income" value={fmt(totalIncome)} />
          <Stat label="Expenses" value={fmt(totalExpenses)} />
        </div>
      </div>
    </header>
  );
}

function Stat({ label, value, className = "" }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-ink/50 text-[11px] uppercase tracking-wide">{label}</span>
      <span
        key={value}
        className={`font-display font-bold animate-page-in ${className}`}
      >
        {value}
      </span>
    </div>
  );
}
