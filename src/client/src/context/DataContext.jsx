import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api.js";
import { mergeCategories } from "../lib/categories.js";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);
  const [settings, setSettings] = useState({
    currency: "$",
    myLabel: "Sripradha",
    spouseLabel: "Laksh",
    budgets: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const [expensesData, incomeData, categoriesData, settingsData] = await Promise.all([
        api.getExpenses(),
        api.getIncome(),
        api.getCategories(),
        api.getSettings(),
      ]);
      setExpenses(expensesData);
      setIncome(incomeData);
      setCustomCategories(categoriesData);
      setSettings({
        currency: settingsData.currency,
        myLabel: settingsData.myLabel,
        spouseLabel: settingsData.spouseLabel,
        budgets: settingsData.budgets || {},
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const categories = useMemo(() => mergeCategories(customCategories), [customCategories]);

  const addExpense = useCallback(async (data) => {
    const created = await api.createExpense(data);
    setExpenses((prev) => [created, ...prev]);
  }, []);

  const bulkAddExpenses = useCallback(async (rows) => {
    const created = await api.bulkCreateExpenses(rows);
    setExpenses((prev) => [...created, ...prev]);
  }, []);

  const removeExpense = useCallback(async (id) => {
    await api.deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  }, []);

  const addIncome = useCallback(async (data) => {
    const created = await api.createIncome(data);
    setIncome((prev) => [created, ...prev]);
  }, []);

  const removeIncome = useCallback(async (id) => {
    await api.deleteIncome(id);
    setIncome((prev) => prev.filter((i) => i._id !== id));
  }, []);

  const addCategory = useCallback(async (data) => {
    const created = await api.createCategory(data);
    setCustomCategories((prev) => [...prev, created]);
  }, []);

  const removeCategory = useCallback(async (id) => {
    await api.deleteCategory(id);
    setCustomCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateSettings = useCallback(async (partial) => {
    const updated = await api.updateSettings({ ...settings, ...partial });
    setSettings({
      currency: updated.currency,
      myLabel: updated.myLabel,
      spouseLabel: updated.spouseLabel,
      budgets: updated.budgets || {},
    });
  }, [settings]);

  const setBudget = useCallback(async (categoryId, amount) => {
    const nextBudgets = { ...settings.budgets, [categoryId]: amount };
    await updateSettings({ budgets: nextBudgets });
  }, [settings.budgets, updateSettings]);

  const resetAll = useCallback(async () => {
    await api.resetAll();
    await refreshAll();
  }, [refreshAll]);

  const value = {
    expenses,
    income,
    categories,
    customCategories,
    settings,
    loading,
    error,
    addExpense,
    bulkAddExpenses,
    removeExpense,
    addIncome,
    removeIncome,
    addCategory,
    removeCategory,
    updateSettings,
    setBudget,
    resetAll,
    refreshAll,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
