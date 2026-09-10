import { useEffect, useMemo, useState } from "react";
import { Download, Check } from "lucide-react";
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

  const [pickerCategoryId, setPickerCategoryId] = useState(categories[0]?.id || "");
  const [pickerAmount, setPickerAmount] = useState("");
  const [pickerRecurring, setPickerRecurring] = useState(true);
  const [pickerSaving, setPickerSaving] = useState(false);
  const [pickerSaved, setPickerSaved] = useState(false);

  useEffect(() => {
    if (!pickerCategoryId && categories[0]) setPickerCategoryId(categories[0].id);
  }, [categories, pickerCategoryId]);

  useEffect(() => {
    if (!pickerCategoryId) return;
    setPickerAmount(String(getEffectiveBudget(settings, pickerCategoryId, key) || ""));
    setPickerRecurring(!isOneTimeBudget(settings, pickerCategoryId, key));
    setPickerSaved(false);
  }, [pickerCategoryId, key, settings]);

  async function handlePickerSave() {
    setPickerSaving(true);
    try {
      await setBudget(pickerCategoryId, parseFloat(pickerAmount) || 0, pickerRecurring ? null : key);
      setPickerSaved(true);
    } finally {
      setPickerSaving(false);
    }
  }

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

      <Card>
        <h3 className="font-semibold text-sm mb-3">Edit a budget</h3>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs text-ink/60 flex-1 min-w-[160px]">
            Category
            <select
              value={pickerCategoryId}
              onChange={(e) => setPickerCategoryId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-ink/60 w-28">
            Amount
            <input
              type="number"
              step="0.01"
              min="0"
              value={pickerAmount}
              onChange={(e) => {
                setPickerAmount(e.target.value);
                setPickerSaved(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handlePickerSave()}
              className="mt-1 w-full rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
            />
          </label>
          <label className="flex items-center gap-1.5 text-xs text-ink/60 pb-2.5">
            <input
              type="checkbox"
              checked={pickerRecurring}
              onChange={(e) => {
                setPickerRecurring(e.target.checked);
                setPickerSaved(false);
              }}
            />
            Recurring (applies every month)
          </label>
          <button
            onClick={handlePickerSave}
            disabled={pickerSaving || !pickerCategoryId}
            className="flex items-center gap-1.5 rounded-lg bg-coral text-white text-sm font-medium px-4 py-2 hover:bg-coral/90 disabled:opacity-50"
          >
            {pickerSaved ? <Check size={15} /> : null}
            {pickerSaving ? "Saving…" : pickerSaved ? "Saved" : "Save"}
          </button>
        </div>
        {!pickerRecurring && (
          <p className="text-xs text-amber-500 mt-2">
            This will only apply to the currently viewed month ({key}) — other months keep the
            recurring amount.
          </p>
        )}
      </Card>

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
