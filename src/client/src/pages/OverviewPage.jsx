import { useMemo } from "react";
import { Download } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import { useMonth } from "../context/MonthContext.jsx";
import { monthKey } from "../lib/month.js";
import { buildMonthlyTrends } from "../lib/trends.js";
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
                    {total.toLocaleString()}{" "}
                    <span className="text-ink/40 font-normal">
                      ({totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0}%)
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
