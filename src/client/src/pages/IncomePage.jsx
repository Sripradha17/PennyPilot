import { useEffect, useMemo, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import { useMonth } from "../context/MonthContext.jsx";
import { monthKey, toInputDate, fromInputDate } from "../lib/month.js";
import Card from "../components/Card.jsx";
import Pagination from "../components/Pagination.jsx";

const PAGE_SIZE = 25;

export default function IncomePage() {
  const { income, settings, addIncome, removeIncome } = useData();
  const { key } = useMonth();
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    date: toInputDate(new Date()),
    amount: "",
    person: "mine",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const monthIncome = useMemo(
    () =>
      income
        .filter((i) => monthKey(new Date(i.date)) === key)
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [income, key]
  );

  useEffect(() => {
    setPage(1);
  }, [key]);

  const pageIncome = monthIncome.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totals = useMemo(() => {
    const mine = monthIncome.filter((i) => i.person === "mine").reduce((s, i) => s + i.amount, 0);
    const spouse = monthIncome.filter((i) => i.person === "spouse").reduce((s, i) => s + i.amount, 0);
    return { mine, spouse, combined: mine + spouse };
  }, [monthIncome]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.amount) return;
    setSubmitting(true);
    try {
      await addIncome({
        date: fromInputDate(form.date),
        amount: parseFloat(form.amount),
        person: form.person,
        note: form.note,
      });
      setForm((f) => ({ ...f, amount: "", note: "" }));
    } finally {
      setSubmitting(false);
    }
  }

  const fmt = (n) => `${settings.currency}${n.toLocaleString()}`;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <p className="text-xs text-ink/50 uppercase">{settings.myLabel}</p>
          <p className="font-display font-bold text-lg text-teal">{fmt(totals.mine)}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-ink/50 uppercase">{settings.spouseLabel}</p>
          <p className="font-display font-bold text-lg text-teal">{fmt(totals.spouse)}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-ink/50 uppercase">Combined</p>
          <p className="font-display font-bold text-lg text-plum">{fmt(totals.combined)}</p>
        </Card>
      </div>

      <Card>
        <h2 className="font-bold text-lg mb-3">Log income</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
            required
          />
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
            className="flex items-center justify-center gap-1.5 rounded-lg bg-teal text-white font-medium px-3 py-2 text-sm hover:bg-teal/90 disabled:opacity-50"
          >
            <Plus size={16} /> Add
          </button>
        </form>
      </Card>

      <Card>
        <h2 className="font-bold text-lg mb-3">This month's income</h2>
        {monthIncome.length === 0 ? (
          <p className="text-ink/50 text-sm py-6 text-center">No income logged yet.</p>
        ) : (
          <ul className="divide-y divide-mist">
            {pageIncome.map((i) => (
              <li
                key={i._id}
                className="flex items-center justify-between py-2.5 gap-3 px-2 -mx-2 rounded-lg hover:bg-mist/50 transition-colors duration-150"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {i.person === "mine" ? settings.myLabel : settings.spouseLabel}
                  </p>
                  <p className="text-xs text-ink/50">
                    {new Date(i.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                    {i.note ? ` · ${i.note}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-semibold">{fmt(i.amount)}</span>
                  <button
                    onClick={() => removeIncome(i._id)}
                    className="text-ink/30 hover:text-red-500 transition"
                    aria-label="Delete income"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Pagination page={page} pageSize={PAGE_SIZE} total={monthIncome.length} onPageChange={setPage} />
      </Card>
    </div>
  );
}
