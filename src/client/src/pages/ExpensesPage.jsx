import { useMemo, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import { useMonth } from "../context/MonthContext.jsx";
import { monthKey, toInputDate } from "../lib/month.js";
import Card from "../components/Card.jsx";
import CategoryBadge from "../components/CategoryBadge.jsx";
import ImportExpenses from "../components/ImportExpenses.jsx";

export default function ExpensesPage() {
  const { expenses, categories, settings, addExpense, removeExpense } = useData();
  const { key } = useMonth();
  const [showImport, setShowImport] = useState(false);

  const [form, setForm] = useState({
    date: toInputDate(new Date()),
    category: categories[0]?.id || "",
    amount: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const monthExpenses = useMemo(
    () =>
      expenses
        .filter((e) => monthKey(new Date(e.date)) === key)
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [expenses, key]
  );

  const categoryById = useMemo(() => {
    const map = {};
    categories.forEach((c) => (map[c.id] = c));
    return map;
  }, [categories]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.amount || !form.category) return;
    setSubmitting(true);
    try {
      await addExpense({
        date: form.date,
        category: form.category,
        amount: parseFloat(form.amount),
        note: form.note,
      });
      setForm((f) => ({ ...f, amount: "", note: "" }));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">Log an expense</h2>
          <button
            onClick={() => setShowImport(true)}
            className="text-sm text-plum font-medium hover:underline"
          >
            Import from Excel/CSV
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="col-span-1 rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
            required
          />
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="col-span-1 rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder={`Amount (${settings.currency})`}
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            className="col-span-1 rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
            required
          />
          <input
            type="text"
            placeholder="Note (optional)"
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            className="col-span-1 rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
          />
          <button
            type="submit"
            disabled={submitting}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 rounded-lg bg-coral text-white font-medium px-3 py-2 text-sm hover:bg-coral/90 disabled:opacity-50"
          >
            <Plus size={16} /> Add
          </button>
        </form>
      </Card>

      <Card>
        <h2 className="font-bold text-lg mb-3">This month's expenses</h2>
        {monthExpenses.length === 0 ? (
          <p className="text-ink/50 text-sm py-6 text-center">No expenses logged yet.</p>
        ) : (
          <ul className="divide-y divide-mist">
            {monthExpenses.map((e) => (
              <li key={e._id} className="flex items-center justify-between py-2.5 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <CategoryBadge category={categoryById[e.category]} />
                  <div className="min-w-0">
                    <p className="text-sm text-ink/60">
                      {new Date(e.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                      {e.note ? ` · ${e.note}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-semibold">
                    {settings.currency}
                    {e.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeExpense(e._id)}
                    className="text-ink/30 hover:text-red-500 transition"
                    aria-label="Delete expense"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {showImport && <ImportExpenses onClose={() => setShowImport(false)} />}
    </div>
  );
}
