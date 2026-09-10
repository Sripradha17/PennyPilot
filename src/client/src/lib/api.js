const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${path} failed: ${res.status} ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getExpenses: () => request("/expenses"),
  createExpense: (data) => request("/expenses", { method: "POST", body: JSON.stringify(data) }),
  bulkCreateExpenses: (rows) =>
    request("/expenses/bulk", { method: "POST", body: JSON.stringify({ rows }) }),
  updateExpense: (id, data) =>
    request(`/expenses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteExpense: (id) => request(`/expenses/${id}`, { method: "DELETE" }),

  getIncome: () => request("/income"),
  createIncome: (data) => request("/income", { method: "POST", body: JSON.stringify(data) }),
  bulkCreateIncome: (rows) =>
    request("/income/bulk", { method: "POST", body: JSON.stringify({ rows }) }),
  deleteIncome: (id) => request(`/income/${id}`, { method: "DELETE" }),

  getSettings: () => request("/settings"),
  updateSettings: (data) => request("/settings", { method: "PUT", body: JSON.stringify(data) }),

  getCategories: () => request("/categories"),
  createCategory: (data) => request("/categories", { method: "POST", body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }),

  resetAll: () => request("/reset", { method: "POST" }),
};
