import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import { useMonth } from "../context/MonthContext.jsx";
import { monthKey } from "../lib/month.js";
import Card from "../components/Card.jsx";
import CategoryBadge from "../components/CategoryBadge.jsx";
import { exportMonthToExcel } from "../lib/exportExcel.js";

export default function BudgetsPage() {
  const { expenses, income, categories, settings, setBudget } = useData();
  const { selectedMonth, key } = useMonth();
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const monthExpenses = useMemo(
    () => expenses.filter((e) => monthKey(new Date(e.date)) === key),
    [expenses, key]
  );
  const monthIncome = useMemo(
    () => income.filter((i) => monthKey(new Date(i.date)) === key),
    [income, key]
  );

  const spentByCategory = useMemo(() => {
    const map = {};
    monthExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return map;
  }, [monthExpenses]);

  function startEdit(c) {
    setEditingId(c.id);
    setEditValue(String(settings.budgets[c.id] || ""));
  }

  async function saveEdit(id) {
    await setBudget(id, parseFloat(editValue) || 0);
    setEditingId(null);
  }

  function handleExport() {
    exportMonthToExcel({
      monthDate: selectedMonth,
      monthKeyStr: key,
      categories,
      settings,
      monthExpenses,
      monthIncome,
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">Monthly budgets</h2>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 rounded-lg bg-plum text-white text-sm font-medium px-3 py-2 hover:bg-plum/90"
        >
          <Download size={16} /> Export to Excel
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {categories.map((c) => {
          const budget = settings.budgets[c.id] || 0;
          const spent = spentByCategory[c.id] || 0;
          const pct = budget > 0 ? (spent / budget) * 100 : 0;

          let barColor = "bg-teal";
          let statusText = "";
          if (c.isFloorGoal) {
            if (spent >= budget && budget > 0) {
              barColor = "bg-emerald-500";
              statusText = `+${settings.currency}${(spent - budget).toLocaleString()} past goal`;
            } else {
              barColor = "bg-gold";
              statusText = budget > 0 ? `${settings.currency}${(budget - spent).toLocaleString()} to goal` : "";
            }
          } else {
            if (pct >= 100) {
              barColor = "bg-red-500";
              statusText = `${settings.currency}${(spent - budget).toLocaleString()} over budget`;
            } else if (pct >= 80) {
              barColor = "bg-amber-500";
              statusText = `${settings.currency}${(budget - spent).toLocaleString()} left`;
            } else {
              barColor = "bg-teal";
              statusText = budget > 0 ? `${settings.currency}${(budget - spent).toLocaleString()} left` : "";
            }
          }

          return (
            <Card key={c.id}>
              <div className="flex items-center justify-between mb-2">
                <CategoryBadge category={c} />
                {editingId === c.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => saveEdit(c.id)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(c.id)}
                      className="w-20 rounded border border-mist px-2 py-1 text-sm"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(c)}
                    className="text-sm text-ink/60 hover:text-plum"
                  >
                    Budget: {settings.currency}
                    {budget.toLocaleString()}
                  </button>
                )}
              </div>
              <div className="h-2.5 rounded-full bg-mist overflow-hidden">
                <div
                  className={`h-full ${barColor} transition-all`}
                  style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5 text-xs text-ink/60">
                <span>
                  Spent {settings.currency}
                  {spent.toLocaleString()}
                </span>
                <span className={statusText.includes("over") ? "text-red-500 font-medium" : ""}>
                  {statusText}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
