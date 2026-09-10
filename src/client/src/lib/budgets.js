export function oneTimeBudgetKey(monthKey, categoryId) {
  return `${monthKey}:${categoryId}`;
}

// Effective budget for a category in a given month: a one-time override for that
// month if one was set, otherwise the recurring monthly amount.
export function getEffectiveBudget(settings, categoryId, monthKey) {
  const oneTime = settings.oneTimeBudgets?.[oneTimeBudgetKey(monthKey, categoryId)];
  if (oneTime !== undefined) return oneTime;
  return settings.budgets?.[categoryId] || 0;
}

export function isOneTimeBudget(settings, categoryId, monthKey) {
  return settings.oneTimeBudgets?.[oneTimeBudgetKey(monthKey, categoryId)] !== undefined;
}
