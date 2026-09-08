import { monthKey, shiftMonth } from "./month.js";

export function buildMonthlyTrends(expenses, income, endMonthDate, monthsBack = 6) {
  const months = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    months.push(shiftMonth(endMonthDate, -i));
  }
  const monthKeys = months.map(monthKey);

  const expensesByMonth = {};
  expenses.forEach((e) => {
    const k = monthKey(new Date(e.date));
    if (!expensesByMonth[k]) expensesByMonth[k] = { total: 0, byCategory: {} };
    expensesByMonth[k].total += e.amount;
    expensesByMonth[k].byCategory[e.category] =
      (expensesByMonth[k].byCategory[e.category] || 0) + e.amount;
  });

  const incomeByMonth = {};
  income.forEach((i) => {
    const k = monthKey(new Date(i.date));
    incomeByMonth[k] = (incomeByMonth[k] || 0) + i.amount;
  });

  const earliestKey = monthKeys[0];
  let savingsCumulative = expenses
    .filter((e) => e.category === "savings" && monthKey(new Date(e.date)) < earliestKey)
    .reduce((s, e) => s + e.amount, 0);
  let investmentCumulative = expenses
    .filter((e) => e.category === "investment" && monthKey(new Date(e.date)) < earliestKey)
    .reduce((s, e) => s + e.amount, 0);

  return months.map((m, idx) => {
    const key = monthKeys[idx];
    const monthExpenses = expensesByMonth[key] || { total: 0, byCategory: {} };
    const monthIncome = incomeByMonth[key] || 0;
    const savingsMonthly = monthExpenses.byCategory.savings || 0;
    const investmentMonthly = monthExpenses.byCategory.investment || 0;
    savingsCumulative += savingsMonthly;
    investmentCumulative += investmentMonthly;

    return {
      key,
      label: m.toLocaleDateString("en-US", { month: "short" }),
      income: Math.round(monthIncome * 100) / 100,
      expenses: Math.round(monthExpenses.total * 100) / 100,
      balance: Math.round((monthIncome - monthExpenses.total) * 100) / 100,
      savingsMonthly: Math.round(savingsMonthly * 100) / 100,
      investmentMonthly: Math.round(investmentMonthly * 100) / 100,
      savingsCumulative: Math.round(savingsCumulative * 100) / 100,
      investmentCumulative: Math.round(investmentCumulative * 100) / 100,
    };
  });
}
