// In production (GitHub Pages) the client and server are on different origins, so the
// build needs an absolute API URL — set via the VITE_API_URL secret in the deploy workflow.
// Local dev has no VITE_API_URL, so it falls back to the relative path Vite proxies to
// localhost:5000 (see vite.config.js).
const BASE = import.meta.env.VITE_API_URL || "/api";

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
