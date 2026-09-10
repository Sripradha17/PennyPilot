import { useMemo, useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { toInputDate } from "../lib/month.js";

export default function DuplicateExpenses({ groups, categories, settings, removeExpense, onClose }) {
  // Default: keep the first entry in each group, mark the rest for deletion.
  const [checked, setChecked] = useState(() => {
    const initial = {};
    groups.forEach((group) => {
      group.slice(1).forEach((e) => {
        initial[e._id] = true;
      });
    });
    return initial;
  });
  const [deleting, setDeleting] = useState(false);

  const checkedCount = useMemo(() => Object.values(checked).filter(Boolean).length, [checked]);

  function toggle(id) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const ids = Object.entries(checked)
        .filter(([, v]) => v)
        .map(([id]) => id);
      for (const id of ids) {
        await removeExpense(id);
      }
      onClose();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-backdrop-in">
      <div className="bg-surface rounded-2xl shadow-soft w-full max-w-2xl max-h-[85vh] flex flex-col animate-modal-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-mist">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            {groups.length} possible duplicate group{groups.length !== 1 ? "s" : ""}
          </h2>
          <button onClick={onClose} className="text-ink/40 hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <p className="text-xs text-ink/50">
            Same date, amount, and note. The first entry in each group is kept by default —
            uncheck any you want to keep instead.
          </p>
          {groups.map((group, i) => (
            <div key={i} className="rounded-lg border border-mist p-3">
              <p className="text-xs text-ink/50 mb-2">
                {toInputDate(group[0].date)} · {settings.currency}
                {group[0].amount.toLocaleString()} · {group[0].note || "(no note)"}
              </p>
              <ul className="space-y-1.5">
                {group.map((e) => (
                  <li key={e._id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!checked[e._id]}
                      onChange={() => toggle(e._id)}
                    />
                    <span className="text-ink/70">
                      {categories.find((c) => c.id === e.category)?.label || e.category}
                    </span>
                    <span className="text-ink/40">·</span>
                    <span className="text-ink/70">
                      {e.person === "spouse" ? settings.spouseLabel : settings.myLabel}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-mist">
          <span className="text-sm text-ink/60">{checkedCount} marked for deletion</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-mist text-sm font-medium px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting || checkedCount === 0}
              className="rounded-lg bg-red-600 text-white text-sm font-medium px-4 py-2 hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "Deleting…" : `Delete ${checkedCount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
