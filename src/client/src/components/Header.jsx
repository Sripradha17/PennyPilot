import MonthNavigator from "./MonthNavigator.jsx";
import { useData } from "../context/DataContext.jsx";
import { useMonth } from "../context/MonthContext.jsx";
import { monthKey } from "../lib/month.js";
import { clearToken } from "../lib/api.js";

export default function Header({ onLogout }) {
  const { expenses, income, settings } = useData();
  const { key } = useMonth();

  const monthExpenses = expenses.filter((e) => monthKey(new Date(e.date)) === key);
  const monthIncome = income.filter((i) => monthKey(new Date(i.date)) === key);

  const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = monthIncome.reduce((sum, i) => sum + i.amount, 0);
  const fmt = (n) => `${settings.currency}${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-surface/90 text-ink shadow-soft backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-[linear-gradient(135deg,rgba(255,183,198,0.95),rgba(189,219,255,0.95))] shadow-[0_18px_28px_-22px_rgba(0,0,0,0.8)]" />
          <div>
            <span className="block font-display text-xl font-extrabold tracking-tight text-ink">Budget Raccoon</span>
            <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-ink/45">Cute finance control</span>
          </div>
        </div>
        <MonthNavigator />
        <div className="flex items-center gap-4 text-sm">
          <Stat label="Income" value={fmt(totalIncome)} />
          <Stat label="Expenses" value={fmt(totalExpenses)} />
          <button
            onClick={() => {
              clearToken();
              onLogout();
            }}
            className="rounded-full bg-white/80 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-ink/60 hover:text-ink"
            aria-label="Log out"
            title="Log out"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

function Stat({ label, value, className = "" }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-ink/45 text-[11px] uppercase tracking-[0.2em]">{label}</span>
      <span
        key={value}
        className={`font-display font-bold animate-page-in ${className}`}
      >
        {value}
      </span>
    </div>
  );
}
