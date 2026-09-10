import { useMemo } from "react";
import { Download, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import { useMonth } from "../context/MonthContext.jsx";
import { monthKey } from "../lib/month.js";
import { buildMonthlyTrends } from "../lib/trends.js";
import { buildInsights } from "../lib/insights.js";
import Card from "../components/Card.jsx";
import CategoryBadge from "../components/CategoryBadge.jsx";
import { IncomeExpenseTrendChart, SavingsInvestmentTrendChart } from "../components/TrendCharts.jsx";
import { exportMonthToExcel } from "../lib/exportExcel.js";

export default function OverviewPage() {
  const { expenses, income, categories, settings } = useData();
  const { selectedMonth, key } = useMonth();

  const monthExpenses = useMemo(
    () => expenses.filter((e) => monthKey(new Date(e.date)) === key),
    [expenses, key]
  );
  const monthIncome = useMemo(
    () => income.filter((i) => monthKey(new Date(i.date)) === key),
    [income, key]
  );

  const byCategory = useMemo(() => {
    const map = {};
    monthExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([id, total]) => ({ category: categories.find((c) => c.id === id), total }))
      .filter((row) => row.category)
      .sort((a, b) => b.total - a.total);
  }, [monthExpenses, categories]);

  const totalExpenses = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const maxTotal = byCategory[0]?.total || 1;

  const trendData = useMemo(
    () => buildMonthlyTrends(expenses, income, selectedMonth, 6),
    [expenses, income, selectedMonth]
  );

  const insights = useMemo(() => buildInsights(expenses, categories, key), [expenses, categories, key]);

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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">Overview</h2>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 rounded-lg bg-plum text-white text-sm font-medium px-3 py-2 hover:bg-plum/90"
        >
          <Download size={16} /> Export to Excel
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <IncomeExpenseTrendChart data={trendData} currency={settings.currency} />
        <SavingsInvestmentTrendChart data={trendData} currency={settings.currency} />
      </div>

      {insights.hasPrevData && (insights.changes.length > 0 || insights.totalPct !== null) && (
        <Card>
          <h3 className="font-bold text-sm flex items-center gap-1.5 mb-3">
            <Sparkles size={15} className="text-gold" /> What changed this month
          </h3>
          <ul className="space-y-2 text-sm">
            {insights.totalPct !== null && Math.abs(insights.totalPct) >= 10 && (
              <li className="flex items-center gap-2">
                {insights.totalPct > 0 ? (
                  <TrendingUp size={15} className="text-coral shrink-0" />
                ) : (
                  <TrendingDown size={15} className="text-teal shrink-0" />
                )}
                <span>
                  Total spending is{" "}
                  <span className={insights.totalPct > 0 ? "text-coral font-medium" : "text-teal font-medium"}>
                    {insights.totalPct > 0 ? "up" : "down"} {Math.abs(insights.totalPct).toFixed(0)}%
                  </span>{" "}
                  from last month
                </span>
              </li>
            )}
            {insights.changes.map((c) => (
              <li key={c.id} className="flex items-center gap-2">
                {c.kind === "down" ? (
                  <TrendingDown size={15} className="text-teal shrink-0" />
                ) : (
                  <TrendingUp size={15} className="text-coral shrink-0" />
                )}
                <span>
                  {c.kind === "new" ? (
                    <>
                      New spending in <span className="font-medium">{c.label}</span>: {settings.currency}
                      {c.delta.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </>
                  ) : (
                    <>
                      <span className="font-medium">{c.label}</span> is{" "}
                      <span className={c.kind === "up" ? "text-coral font-medium" : "text-teal font-medium"}>
                        {c.kind === "up" ? "up" : "down"} {Math.abs(c.pct).toFixed(0)}%
                      </span>{" "}
                      from last month
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <h2 className="font-bold text-lg">This month's category breakdown</h2>
      <Card>
        {byCategory.length === 0 ? (
          <p className="text-ink/50 text-sm py-6 text-center">
            No expenses yet this month — log one to see your breakdown.
          </p>
        ) : (
          <ul className="space-y-3">
            {byCategory.map(({ category, total }) => (
              <li key={category.id}>
                <div className="flex items-center justify-between mb-1">
                  <CategoryBadge category={category} />
                  <span className="text-sm font-semibold">
                    {settings.currency}
                    {total.toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
                    <span className="text-ink/40 font-normal">
                      ({totalExpenses > 0 ? ((total / totalExpenses) * 100).toFixed(2) : "0.00"}%)
                    </span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-mist overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(total / maxTotal) * 100}%`,
                      backgroundColor: category.badgeColor,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
