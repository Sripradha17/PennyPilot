import * as XLSX from "xlsx";

export function exportMonthToExcel({ monthDate, monthKeyStr, categories, settings, monthExpenses, monthIncome }) {
  const spentByCategory = {};
  monthExpenses.forEach((e) => {
    spentByCategory[e.category] = (spentByCategory[e.category] || 0) + e.amount;
  });

  const budgetRows = categories.map((c) => {
    const budgeted = settings.budgets[c.id] || 0;
    const spent = spentByCategory[c.id] || 0;
    const remaining = budgeted - spent;
    const pctUsed = budgeted > 0 ? Math.round((spent / budgeted) * 100) : 0;
    return {
      Category: c.label,
      Budgeted: budgeted,
      Spent: spent,
      [c.isFloorGoal ? "Past Goal" : "Remaining"]: c.isFloorGoal ? Math.max(0, spent - budgeted) : remaining,
      "% Used": budgeted > 0 ? `${pctUsed}%` : "-",
    };
  });

  const totalIncome = monthIncome.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const mineIncome = monthIncome.filter((i) => i.person === "mine").reduce((s, i) => s + i.amount, 0);
  const spouseIncome = monthIncome.filter((i) => i.person === "spouse").reduce((s, i) => s + i.amount, 0);

  const summaryRows = [
    { Metric: "Total Income", Value: totalIncome },
    { Metric: `Income — ${settings.myLabel}`, Value: mineIncome },
    { Metric: `Income — ${settings.spouseLabel}`, Value: spouseIncome },
    { Metric: "Total Expenses", Value: totalExpenses },
    { Metric: "Balance", Value: totalIncome - totalExpenses },
  ];

  const workbook = XLSX.utils.book_new();
  const budgetSheet = XLSX.utils.json_to_sheet(budgetRows);
  const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(workbook, budgetSheet, "Budget");
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  XLSX.writeFile(workbook, `budget-${monthKeyStr}.xlsx`);
}
