import { useMemo } from "react";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import Card from "../components/Card.jsx";
import CategoryBadge from "../components/CategoryBadge.jsx";

// Money moved into an Investment/Savings-flavored category isn't "spent" —
// it's still yours, just in a different form — so it's excluded from
// spending and added back into net worth instead of subtracted from it.
function isWealthCategory(category) {
  const text = `${category?.id || ""} ${category?.label || ""}`.toLowerCase();
  return text.includes("invest") || text.includes("saving");
}

export default function NetWorthPage() {
  const { expenses, income, categories, settings } = useData();

  const categoryById = useMemo(() => {
    const map = {};
    categories.forEach((c) => (map[c.id] = c));
    return map;
  }, [categories]);

  const totals = useMemo(() => {
    const totalIncome = income.reduce((s, i) => s + i.amount, 0);
    let spending = 0;
    let investedAndSaved = 0;
    for (const e of expenses) {
      if (isWealthCategory(categoryById[e.category])) {
        investedAndSaved += e.amount;
      } else {
        spending += e.amount;
      }
    }
    return { totalIncome, spending, investedAndSaved, netWorth: totalIncome - spending };
  }, [expenses, income, categoryById]);

  const wealthByCategory = useMemo(() => {
    const map = {};
    for (const e of expenses) {
      const cat = categoryById[e.category];
      if (!isWealthCategory(cat)) continue;
      map[e.category] = (map[e.category] || 0) + e.amount;
    }
    return Object.entries(map)
      .map(([id, total]) => ({ category: categoryById[id], total }))
      .filter((r) => r.category)
      .sort((a, b) => b.total - a.total);
  }, [expenses, categoryById]);

  const fmt = (n) => `${settings.currency}${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-5">
      <Card className="text-center">
        <p className="text-xs text-ink/50 uppercase">Net worth</p>
        <p className={`font-display font-bold text-4xl ${totals.netWorth >= 0 ? "text-teal" : "text-coral"}`}>
          {totals.netWorth < 0 ? "-" : ""}
          {fmt(Math.abs(totals.netWorth))}
        </p>
        <p className="text-xs text-ink/40 mt-1.5 max-w-xs mx-auto">
          Everything you've earned, minus everyday spending. Money in your Investment and Savings
          categories always counts toward this — it's never treated as spent.
        </p>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <p className="text-xs text-ink/50 uppercase mb-1">Total income, all time</p>
          <p className="font-display font-bold text-xl text-teal flex items-center gap-1.5">
            <TrendingUp size={18} /> {fmt(totals.totalIncome)}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-ink/50 uppercase mb-1">Everyday spending, all time</p>
          <p className="font-display font-bold text-xl text-coral flex items-center gap-1.5">
            <TrendingDown size={18} /> {fmt(totals.spending)}
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="font-bold text-lg mb-3 flex items-center gap-1.5">
          <Sparkles size={17} className="text-gold" /> Invested & saved
        </h2>
        {wealthByCategory.length === 0 ? (
          <div className="flex flex-col items-center py-6 gap-2">
            <p className="text-ink/50 text-sm text-center">
              Nothing logged in an Investment or Savings category yet.
            </p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-mist">
              {wealthByCategory.map(({ category, total }) => (
                <li key={category.id} className="flex items-center justify-between py-2.5">
                  <CategoryBadge category={category} />
                  <span className="text-sm font-semibold text-teal">{fmt(total)}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between pt-2 mt-1 border-t border-mist text-sm font-bold">
              <span>Total</span>
              <span>{fmt(totals.investedAndSaved)}</span>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
