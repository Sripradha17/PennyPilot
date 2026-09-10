import { useState } from "react";
import { Plus, Trash2, AlertTriangle, Check } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import { colorForNewCategory } from "../lib/categories.js";
import Card from "../components/Card.jsx";
import CategoryBadge from "../components/CategoryBadge.jsx";

export default function SettingsPage() {
  const {
    settings,
    customCategories,
    categories,
    updateSettings,
    addCategory,
    removeCategory,
    resetAll,
    setBudget,
  } = useData();

  const [currency, setCurrency] = useState(settings.currency);
  const [myLabel, setMyLabel] = useState(settings.myLabel);
  const [spouseLabel, setSpouseLabel] = useState(settings.spouseLabel);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryBudget, setNewCategoryBudget] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [saving, setSaving] = useState(false);
  const [budgetEdits, setBudgetEdits] = useState({});
  const [savingBudgetId, setSavingBudgetId] = useState(null);

  async function handleSaveGeneral(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({ currency, myLabel, spouseLabel });
    } finally {
      setSaving(false);
    }
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await addCategory({
      id,
      label: name,
      badgeColor: colorForNewCategory(customCategories.length),
    });
    const budgetAmount = parseFloat(newCategoryBudget);
    if (!Number.isNaN(budgetAmount) && budgetAmount > 0) {
      await setBudget(id, budgetAmount);
    }
    setNewCategoryName("");
    setNewCategoryBudget("");
  }

  async function handleSaveBudget(categoryId) {
    const raw = budgetEdits[categoryId];
    const amount = parseFloat(raw);
    setSavingBudgetId(categoryId);
    try {
      await setBudget(categoryId, Number.isNaN(amount) ? 0 : amount);
      setBudgetEdits((prev) => {
        const next = { ...prev };
        delete next[categoryId];
        return next;
      });
    } finally {
      setSavingBudgetId(null);
    }
  }

  async function handleReset() {
    await resetAll();
    setConfirmReset(false);
  }

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="font-bold text-lg mb-3">General</h2>
        <form onSubmit={handleSaveGeneral} className="grid sm:grid-cols-3 gap-3">
          <label className="text-sm">
            Currency symbol
            <input
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 w-full rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
            />
          </label>
          <label className="text-sm">
            Your label
            <input
              value={myLabel}
              onChange={(e) => setMyLabel(e.target.value)}
              className="mt-1 w-full rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
            />
          </label>
          <label className="text-sm">
            Spouse label
            <input
              value={spouseLabel}
              onChange={(e) => setSpouseLabel(e.target.value)}
              className="mt-1 w-full rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="sm:col-span-3 justify-self-start rounded-lg bg-coral text-white text-sm font-medium px-4 py-2 hover:bg-coral/90 disabled:opacity-50"
          >
            Save
          </button>
        </form>
      </Card>

      <Card>
        <h2 className="font-bold text-lg mb-1">Categories</h2>
        <p className="text-xs text-ink/50 mb-3">
          Each category's budget allocation applies every month until you change it here again.
        </p>
        <ul className="space-y-1.5 mb-4">
          {categories.map((c) => {
            const isEditing = budgetEdits[c.id] !== undefined;
            const currentBudget = settings.budgets?.[c.id] || 0;
            return (
              <li
                key={c.id}
                className="flex items-center gap-2 rounded-lg border border-mist px-2.5 py-1.5"
              >
                <div className="min-w-0 flex-1">
                  <CategoryBadge category={c} />
                </div>
                <span className="text-xs text-ink/40 shrink-0">{settings.currency}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={isEditing ? budgetEdits[c.id] : currentBudget || ""}
                  placeholder="0"
                  onChange={(e) =>
                    setBudgetEdits((prev) => ({ ...prev, [c.id]: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleSaveBudget(c.id)}
                  className="w-20 shrink-0 rounded border border-mist px-2 py-1 text-xs focus:outline-coral"
                />
                {isEditing && (
                  <button
                    onClick={() => handleSaveBudget(c.id)}
                    disabled={savingBudgetId === c.id}
                    className="shrink-0 flex items-center justify-center rounded bg-teal text-white p-1 hover:bg-teal/90 disabled:opacity-50"
                    aria-label={`Save budget for ${c.label}`}
                  >
                    <Check size={13} />
                  </button>
                )}
                {c.isCustom && (
                  <button
                    onClick={() => removeCategory(c.id)}
                    className="shrink-0 text-ink/30 hover:text-red-500"
                    aria-label={`Delete ${c.label}`}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        <form onSubmit={handleAddCategory} className="flex flex-wrap gap-2">
          <input
            placeholder="New category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-1 min-w-[140px] rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
          />
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder={`Budget (${settings.currency}, optional)`}
            value={newCategoryBudget}
            onChange={(e) => setNewCategoryBudget(e.target.value)}
            className="w-40 rounded-lg border border-mist px-3 py-2 text-sm focus:outline-coral"
          />
          <button
            type="submit"
            className="shrink-0 flex items-center gap-1.5 rounded-lg bg-teal text-white text-sm font-medium px-3 py-2 hover:bg-teal/90"
          >
            <Plus size={16} /> Add
          </button>
        </form>
      </Card>

      <Card className="border border-red-500/30">
        <h2 className="font-bold text-lg mb-2 text-red-400 flex items-center gap-2">
          <AlertTriangle size={18} /> Danger zone
        </h2>
        <p className="text-sm text-ink/60 mb-3">
          This permanently deletes all expenses, income, custom categories, and settings from
          MongoDB. This cannot be undone.
        </p>
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="rounded-lg border border-red-500/40 text-red-400 text-sm font-medium px-4 py-2 hover:bg-red-500/10"
          >
            Reset all data
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Are you sure?</span>
            <button
              onClick={handleReset}
              className="rounded-lg bg-red-600 text-white text-sm font-medium px-4 py-2 hover:bg-red-700"
            >
              Yes, delete everything
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="rounded-lg border border-mist text-sm font-medium px-4 py-2"
            >
              Cancel
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
