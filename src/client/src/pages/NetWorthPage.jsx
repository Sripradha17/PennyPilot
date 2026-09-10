import { useMemo, useState } from "react";
import { Plus, Trash2, Landmark, PiggyBank } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import { toInputDate, fromInputDate } from "../lib/month.js";
import Card from "../components/Card.jsx";

const TYPE_LABELS = { asset: "Asset", liability: "Liability", investment: "Investment" };

export default function NetWorthPage() {
  const { balances, settings, addBalance, removeBalance } = useData();

  const [form, setForm] = useState({
    name: "",
    type: "asset",
    amount: "",
    date: toInputDate(new Date()),
  });
  const [submitting, setSubmitting] = useState(false);

  // Only the latest entry per account name counts toward the current total —
  // older entries stay in the list as history but don't double-count.
  const latestByName = useMemo(() => {
    const map = new Map();
    for (const b of balances) {
      const existing = map.get(b.name);
      if (!existing || new Date(b.date) > new Date(existing.date)) {
        map.set(b.name, b);
      }
    }
    return [...map.values()];
  }, [balances]);

  const netWorth = useMemo(() => {
    return latestByName.reduce((sum, b) => sum + (b.type === "liability" ? -b.amount : b.amount), 0);
  }, [latestByName]);

  const investments = latestByName.filter((b) => b.type === "investment");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.amount) return;
    setSubmitting(true);
    try {
      await addBalance({
        name: form.name,
        type: form.type,
        amount: parseFloat(form.amount),
        date: fromInputDate(form.date),
      });
      setForm((f) => ({ ...f, name: "", amount: "" }));
    } finally {
      setSubmitting(false);
    }
  }

  const fmt = (n) => `${settings.currency}${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-5">
      <Card className="text-center">
        <p className="text-xs text-ink/50 uppercase">Net worth</p>
        <p className={`font-display font-bold text-3xl ${netWorth >= 0 ? "text-teal" : "text-coral"}`}>
          {netWorth < 0 ? "-" : ""}
          {fmt(Math.abs(netWorth))}
        </p>
        <p className="text-xs text-ink/40 mt-1">
          Based on the latest balance you've logged for each account
        </p>
      </Card>

      <Card>
        <h2 className="font-bold text-lg mb-3">Log a balance</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Account name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="sm:col-span-2 rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
            required
          />
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            className="rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
          >
            <option value="asset">Asset (bank, etc.)</option>
            <option value="investment">Investment</option>
            <option value="liability">Liability / debt</option>
          </select>
          <input
            type="number"
            step="0.01"
            placeholder={`Amount (${settings.currency})`}
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            className="rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
            required
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
          />
          <button
            type="submit"
            disabled={submitting}
            className="sm:col-span-5 flex items-center justify-center gap-1.5 rounded-lg bg-coral text-white font-medium px-3 py-2 text-sm hover:bg-coral/90 disabled:opacity-50 sm:w-auto sm:justify-self-start sm:px-6"
          >
            <Plus size={16} /> Add
          </button>
        </form>
      </Card>

      <Card>
        <h2 className="font-bold text-lg mb-3 flex items-center gap-1.5">
          <Landmark size={17} className="text-teal" /> Accounts
        </h2>
        {latestByName.length === 0 ? (
          <p className="text-ink/50 text-sm py-6 text-center">No balances logged yet.</p>
        ) : (
          <ul className="divide-y divide-mist">
            {latestByName.map((b) => (
              <li key={b._id} className="flex items-center justify-between py-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{b.name}</p>
                  <p className="text-xs text-ink/50">
                    {TYPE_LABELS[b.type]} · {new Date(b.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`font-semibold text-sm ${b.type === "liability" ? "text-coral" : "text-teal"}`}>
                    {b.type === "liability" ? "-" : ""}
                    {fmt(b.amount)}
                  </span>
                  <button
                    onClick={() => removeBalance(b._id)}
                    className="text-ink/30 hover:text-red-500"
                    aria-label={`Delete ${b.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {investments.length > 0 && (
        <Card>
          <h2 className="font-bold text-lg mb-3 flex items-center gap-1.5">
            <PiggyBank size={17} className="text-plum" /> Investment portfolio
          </h2>
          <ul className="divide-y divide-mist">
            {investments.map((b) => (
              <li key={b._id} className="flex items-center justify-between py-2">
                <span className="text-sm">{b.name}</span>
                <span className="text-sm font-semibold">{fmt(b.amount)}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between pt-2 mt-1 border-t border-mist text-sm font-bold">
            <span>Total</span>
            <span>{fmt(investments.reduce((s, b) => s + b.amount, 0))}</span>
          </div>
        </Card>
      )}
    </div>
  );
}
