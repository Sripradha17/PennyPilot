import { monthKey } from "./month.js";

function totalsByCategory(expenses, mk) {
  const map = {};
  for (const e of expenses) {
    if (monthKey(new Date(e.date)) !== mk) continue;
    map[e.category] = (map[e.category] || 0) + e.amount;
  }
  return map;
}

function prevMonthKey(mk) {
  const [y, m] = mk.split("-").map(Number);
  const pm = m === 1 ? 12 : m - 1;
  const py = m === 1 ? y - 1 : y;
  return `${py}-${String(pm).padStart(2, "0")}`;
}

// Deterministic month-over-month comparison — no AI call, just arithmetic —
// so it's free, instant, and never hallucinates a number.
export function buildInsights(expenses, categories, currentMonthKey) {
  const prevKey = prevMonthKey(currentMonthKey);
  const current = totalsByCategory(expenses, currentMonthKey);
  const previous = totalsByCategory(expenses, prevKey);
  const categoryLabel = (id) => categories.find((c) => c.id === id)?.label || id;

  const changes = [];
  const ids = new Set([...Object.keys(current), ...Object.keys(previous)]);
  for (const id of ids) {
    const now = current[id] || 0;
    const prev = previous[id] || 0;
    if (prev < 5 && now < 5) continue; // ignore near-zero noise
    if (prev === 0) {
      changes.push({ id, label: categoryLabel(id), pct: null, delta: now, kind: "new" });
      continue;
    }
    const pct = ((now - prev) / prev) * 100;
    if (Math.abs(pct) < 15) continue;
    changes.push({ id, label: categoryLabel(id), pct, delta: now - prev, kind: pct > 0 ? "up" : "down" });
  }
  changes.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  const totalNow = Object.values(current).reduce((s, v) => s + v, 0);
  const totalPrev = Object.values(previous).reduce((s, v) => s + v, 0);
  const totalPct = totalPrev > 0 ? ((totalNow - totalPrev) / totalPrev) * 100 : null;

  return {
    changes: changes.slice(0, 3),
    totalNow,
    totalPrev,
    totalPct,
    hasPrevData: totalPrev > 0,
  };
}
