import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import { useMonth } from "../context/MonthContext.jsx";
import { monthKey } from "../lib/month.js";
import Card from "../components/Card.jsx";
import CategoryBadge from "../components/CategoryBadge.jsx";
import Pagination from "../components/Pagination.jsx";
import { exportMonthToExcel } from "../lib/exportExcel.js";
import { getEffectiveBudget, isOneTimeBudget } from "../lib/budgets.js";

const PAGE_SIZE = 10;

export default function BudgetsPage() {
  const { expenses, income, categories, settings, setBudget } = useData();
  const { selectedMonth, key } = useMonth();
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editRecurring, setEditRecurring] = useState(true);
  const [page, setPage] = useState(1);

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
    setEditValue(String(getEffectiveBudget(settings, c.id, key) || ""));
    setEditRecurring(!isOneTimeBudget(settings, c.id, key));
  }

  async function saveEdit(id) {
    await setBudget(id, parseFloat(editValue) || 0, editRecurring ? null : key);
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
        {categories.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((c) => {
          const budget = getEffectiveBudget(settings, c.id, key);
          const oneTime = isOneTimeBudget(settings, c.id, key);
          const spent = spentByCategory[c.id] || 0;
          const pct = budget > 0 ? (spent / budget) * 100 : 0;

          const atBudget = budget > 0 && Math.abs(spent - budget) < 0.005;

          let barColor = "bg-teal";
          let statusText = "";
          if (budget === 0) {
            statusText = spent > 0 ? "No budget set for this category" : "";
          } else if (c.isFloorGoal) {
            if (atBudget) {
              barColor = "bg-emerald-500";
              statusText = "Right at goal";
            } else if (spent > budget) {
              barColor = "bg-emerald-500";
              statusText = `+${settings.currency}${(spent - budget).toLocaleString()} past goal`;
            } else {
              barColor = "bg-gold";
              statusText = `${settings.currency}${(budget - spent).toLocaleString()} to goal`;
            }
          } else if (atBudget) {
            barColor = "bg-amber-500";
            statusText = "Right at budget";
          } else if (pct > 100) {
            barColor = "bg-red-500";
            statusText = `${settings.currency}${(spent - budget).toLocaleString()} over budget`;
          } else if (pct >= 80) {
            barColor = "bg-amber-500";
            statusText = `${settings.currency}${(budget - spent).toLocaleString()} left`;
          } else {
            barColor = "bg-teal";
            statusText = `${settings.currency}${(budget - spent).toLocaleString()} left`;
          }

          return (
            <Card key={c.id} className="hover:bg-surface2 hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <CategoryBadge category={c} />
                {editingId === c.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(c.id)}
                      className="w-20 rounded border border-mist px-2 py-1 text-sm"
                    />
                    <label className="flex items-center gap-1 text-xs text-ink/60">
                      <input
                        type="checkbox"
                        checked={editRecurring}
                        onChange={(e) => setEditRecurring(e.target.checked)}
                      />
                      Recurring
                    </label>
                    <button
                      onClick={() => saveEdit(c.id)}
                      className="rounded bg-teal text-white text-xs font-medium px-2 py-1 hover:bg-teal/90"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(c)}
                    className="text-sm text-ink/60 hover:text-plum"
                  >
                    Budget: {settings.currency}
                    {budget.toLocaleString()}
                    {oneTime && <span className="text-amber-600"> (this month)</span>}
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

      <Pagination page={page} pageSize={PAGE_SIZE} total={categories.length} onPageChange={setPage} />
    </div>
  );
}
