import { Target } from "lucide-react";
import Card from "./Card.jsx";

export default function BudgetOverviewCard({ rows, totalBudget, totalSpent, currency, className = "" }) {
  const overallPct = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;
  const fmt = (n) => `${currency}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-sm flex items-center gap-1.5">
          <Target size={15} className="text-forest" /> Monthly budget
        </h3>
        <span className="text-xs font-bold text-ink/50">{overallPct.toFixed(0)}% used</span>
      </div>

      {totalBudget === 0 ? (
        <p className="text-ink/50 text-sm py-4 text-center">
          Set a budget for a category to see your progress here.
        </p>
      ) : (
        <>
          <p className="font-display text-2xl font-extrabold text-ink tabular-nums">
            {fmt(totalSpent)} <span className="text-base font-semibold text-ink/40">/ {fmt(totalBudget)}</span>
          </p>
          <div className="mt-2.5 h-3 rounded-full bg-mist overflow-hidden">
            <div
              className={`h-full rounded-full transition-[width] duration-700 ease-out ${
                overallPct >= 100 ? "bg-coral" : overallPct >= 80 ? "bg-gold" : "bg-forest"
              }`}
              style={{ width: `${overallPct}%` }}
            />
          </div>

          <ul className="mt-4 space-y-3">
            {rows.slice(0, 4).map((r) => {
              const pct = r.budget > 0 ? Math.min(100, (r.spent / r.budget) * 100) : 0;
              const Icon = r.category.icon;
              return (
                <li key={r.category.id}>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-ink/75">
                      <Icon size={12} style={{ color: r.category.badgeColor }} />
                      {r.category.label}
                    </span>
                    <span className="text-ink/45 tabular-nums">
                      {fmt(r.spent)} / {fmt(r.budget)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-mist overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-700 ease-out"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: pct >= 100 ? "#ff9a76" : r.category.badgeColor,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Card>
  );
}
