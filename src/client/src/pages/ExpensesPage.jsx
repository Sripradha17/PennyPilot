import { useEffect, useMemo, useState } from "react";
import { Trash2, Plus, Pencil, X, Check, Search, AlertTriangle, Upload } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import { useMonth } from "../context/MonthContext.jsx";
import { monthKey, toInputDate, fromInputDate } from "../lib/month.js";
import { findDuplicateGroups } from "../lib/duplicates.js";
import Card from "../components/Card.jsx";
import CategoryBadge from "../components/CategoryBadge.jsx";
import ImportExpenses from "../components/ImportExpenses.jsx";
import DuplicateExpenses from "../components/DuplicateExpenses.jsx";
import Pagination from "../components/Pagination.jsx";

export default function ExpensesPage() {
  const { expenses, categories, settings, addExpense, updateExpense, removeExpense } = useData();
  const { key } = useMonth();
  const [showImport, setShowImport] = useState(false);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPerson, setFilterPerson] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const PAGE_SIZE = 25;
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    date: toInputDate(new Date()),
    category: categories[0]?.id || "",
    amount: "",
    note: "",
    person: "mine",
  });
  const [submitting, setSubmitting] = useState(false);

  const monthExpenses = useMemo(
    () => expenses.filter((e) => monthKey(new Date(e.date)) === key),
    [expenses, key]
  );

  const visibleExpenses = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = monthExpenses.filter((e) => {
      if (filterCategory !== "all" && e.category !== filterCategory) return false;
      if (filterPerson !== "all" && (e.person || "mine") !== filterPerson) return false;
      if (q && !(e.note || "").toLowerCase().includes(q)) return false;
      return true;
    });
    const sorters = {
      "date-desc": (a, b) => new Date(b.date) - new Date(a.date),
      "date-asc": (a, b) => new Date(a.date) - new Date(b.date),
      "amount-desc": (a, b) => b.amount - a.amount,
      "amount-asc": (a, b) => a.amount - b.amount,
    };
    return rows.sort(sorters[sortBy]);
  }, [monthExpenses, search, filterCategory, filterPerson, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [key, search, filterCategory, filterPerson, sortBy]);

  const pagedExpenses = visibleExpenses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const duplicateGroups = useMemo(() => findDuplicateGroups(expenses), [expenses]);

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
        date: fromInputDate(form.date),
        category: form.category,
        amount: parseFloat(form.amount),
        note: form.note,
        person: form.person,
      });
      setForm((f) => ({ ...f, amount: "", note: "" }));
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(e) {
    setEditingId(e._id);
    setEditForm({
      date: toInputDate(e.date),
      category: e.category,
      amount: String(e.amount),
      note: e.note || "",
      person: e.person || "mine",
    });
  }

  async function saveEdit(id) {
    await updateExpense(id, {
      date: fromInputDate(editForm.date),
      category: editForm.category,
      amount: parseFloat(editForm.amount) || 0,
      note: editForm.note,
      person: editForm.person,
    });
    setEditingId(null);
    setEditForm(null);
  }

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="font-bold text-lg">Log an expense</h2>
          <div className="flex items-center gap-3">
            {duplicateGroups.length > 0 && (
              <button
                onClick={() => setShowDuplicates(true)}
                className="flex items-center gap-1 text-sm text-amber-600 font-medium hover:underline"
              >
                <AlertTriangle size={14} />
                {duplicateGroups.length} possible duplicate{duplicateGroups.length !== 1 ? "s" : ""}
              </button>
            )}
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-1.5 rounded-lg bg-plum text-white text-sm font-medium px-3 py-2 hover:bg-plum/90"
            >
              <Upload size={15} /> Import from Excel/CSV
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-6 gap-3">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
            required
          />
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <select
            value={form.person}
            onChange={(e) => setForm((f) => ({ ...f, person: e.target.value }))}
            className="rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
          >
            <option value="mine">{settings.myLabel}</option>
            <option value="spouse">{settings.spouseLabel}</option>
          </select>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder={`Amount (${settings.currency})`}
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            className="rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
            required
          />
          <input
            type="text"
            placeholder="Note (optional)"
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            className="rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-coral text-white font-medium px-3 py-2 text-sm hover:bg-coral/90 disabled:opacity-50"
          >
            <Plus size={16} /> Add
          </button>
        </form>
      </Card>

      <Card>
        <h2 className="font-bold text-lg mb-3">This month's expenses</h2>

        {monthExpenses.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 mb-3">
            <div className="relative sm:flex-1 sm:min-w-[160px]">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/30" />
              <input
                type="text"
                placeholder="Search notes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-mist pl-8 pr-3 py-1.5 text-sm focus:outline-coral"
              />
            </div>
            <div className="grid grid-cols-2 sm:flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="rounded-lg border border-mist px-2 py-1.5 text-sm"
              >
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <select
                value={filterPerson}
                onChange={(e) => setFilterPerson(e.target.value)}
                className="rounded-lg border border-mist px-2 py-1.5 text-sm"
              >
                <option value="all">Everyone</option>
                <option value="mine">{settings.myLabel}</option>
                <option value="spouse">{settings.spouseLabel}</option>
              </select>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-mist px-2 py-1.5 text-sm"
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="amount-desc">Amount: high to low</option>
              <option value="amount-asc">Amount: low to high</option>
            </select>
          </div>
        )}

        {monthExpenses.length === 0 ? (
          <p className="text-ink/50 text-sm py-6 text-center">No expenses logged yet.</p>
        ) : visibleExpenses.length === 0 ? (
          <p className="text-ink/50 text-sm py-6 text-center">No expenses match your search/filters.</p>
        ) : (
          <ul className="divide-y divide-mist">
            {pagedExpenses.map((e) =>
              editingId === e._id ? (
                <li key={e._id} className="py-2.5">
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(ev) => setEditForm((f) => ({ ...f, date: ev.target.value }))}
                      className="col-span-2 sm:col-span-1 rounded border border-mist px-2 py-1.5 text-xs"
                    />
                    <select
                      value={editForm.category}
                      onChange={(ev) => setEditForm((f) => ({ ...f, category: ev.target.value }))}
                      className="col-span-1 rounded border border-mist px-2 py-1.5 text-xs"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editForm.person}
                      onChange={(ev) => setEditForm((f) => ({ ...f, person: ev.target.value }))}
                      className="col-span-1 rounded border border-mist px-2 py-1.5 text-xs"
                    >
                      <option value="mine">{settings.myLabel}</option>
                      <option value="spouse">{settings.spouseLabel}</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.amount}
                      onChange={(ev) => setEditForm((f) => ({ ...f, amount: ev.target.value }))}
                      className="col-span-1 rounded border border-mist px-2 py-1.5 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Note"
                      value={editForm.note}
                      onChange={(ev) => setEditForm((f) => ({ ...f, note: ev.target.value }))}
                      className="col-span-1 rounded border border-mist px-2 py-1.5 text-xs"
                    />
                    <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
                      <button
                        onClick={() => saveEdit(e._id)}
                        className="flex items-center justify-center rounded bg-teal text-white p-1.5 hover:bg-teal/90"
                        aria-label="Save"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditForm(null);
                        }}
                        className="flex items-center justify-center rounded border border-mist p-1.5 hover:bg-mist/40"
                        aria-label="Cancel"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ) : (
                <li
                  key={e._id}
                  className="flex items-center justify-between py-2.5 gap-3 px-2 -mx-2 rounded-lg hover:bg-mist/50 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CategoryBadge category={categoryById[e.category]} />
                    <div className="min-w-0">
                      <p className="text-sm text-ink/60">
                        {new Date(e.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                        {" · "}
                        {e.person === "spouse" ? settings.spouseLabel : settings.myLabel}
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
                      onClick={() => startEdit(e)}
                      className="text-ink/30 hover:text-plum transition"
                      aria-label="Edit expense"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => removeExpense(e._id)}
                      className="text-ink/30 hover:text-red-500 transition"
                      aria-label="Delete expense"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        )}

        <Pagination page={page} pageSize={PAGE_SIZE} total={visibleExpenses.length} onPageChange={setPage} />
      </Card>

      {showImport && <ImportExpenses onClose={() => setShowImport(false)} />}
      {showDuplicates && (
        <DuplicateExpenses
          groups={duplicateGroups}
          categories={categories}
          settings={settings}
          removeExpense={removeExpense}
          onClose={() => setShowDuplicates(false)}
        />
      )}
    </div>
  );
}
