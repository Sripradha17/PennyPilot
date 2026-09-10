import { useMemo, useState } from "react";
import { X, AlertTriangle, ShieldCheck } from "lucide-react";
import { toInputDate } from "../lib/month.js";

export default function DuplicateExpenses({ groups, categories, settings, removeExpense, onKeepGroup, onClose }) {
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
  const [keptIndexes, setKeptIndexes] = useState(() => new Set());
  const [keepingIndex, setKeepingIndex] = useState(null);

  const visibleGroups = useMemo(
    () => groups.map((g, i) => ({ group: g, i })).filter(({ i }) => !keptIndexes.has(i)),
    [groups, keptIndexes]
  );

  const checkedCount = useMemo(() => {
    const visibleIds = new Set(visibleGroups.flatMap(({ group }) => group.map((e) => e._id)));
    return Object.entries(checked).filter(([id, v]) => v && visibleIds.has(id)).length;
  }, [checked, visibleGroups]);

  function toggle(id) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function handleKeep(group, i) {
    setKeepingIndex(i);
    try {
      await onKeepGroup(group);
      setKeptIndexes((prev) => new Set(prev).add(i));
    } finally {
      setKeepingIndex(null);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const visibleIds = new Set(visibleGroups.flatMap(({ group }) => group.map((e) => e._id)));
      const ids = Object.entries(checked)
        .filter(([id, v]) => v && visibleIds.has(id))
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
            {visibleGroups.length} possible duplicate group{visibleGroups.length !== 1 ? "s" : ""}
          </h2>
          <button onClick={onClose} className="text-ink/40 hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <p className="text-xs text-ink/50">
            Same date, amount, and note. The first entry in each group is kept by default —
            uncheck any you want to keep instead. If a group is actually two separate
            transactions, hit "Not a duplicate" so it stops being flagged.
          </p>
          {visibleGroups.length === 0 && (
            <p className="text-sm text-ink/50 text-center py-6">No duplicate groups left to review.</p>
          )}
          {visibleGroups.map(({ group, i }) => (
            <div key={i} className="rounded-lg border border-mist p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-xs text-ink/50">
                  {toInputDate(group[0].date)} · {settings.currency}
                  {group[0].amount.toLocaleString()} · {group[0].note || "(no note)"}
                </p>
                <button
                  onClick={() => handleKeep(group, i)}
                  disabled={keepingIndex === i}
                  className="shrink-0 flex items-center gap-1 rounded-md border border-mist text-xs font-medium px-2 py-1 text-ink/70 hover:text-teal hover:border-teal/50 disabled:opacity-50"
                  title="These are separate transactions — stop flagging this as a duplicate"
                >
                  <ShieldCheck size={12} />
                  {keepingIndex === i ? "Saving…" : "Not a duplicate"}
                </button>
              </div>
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
