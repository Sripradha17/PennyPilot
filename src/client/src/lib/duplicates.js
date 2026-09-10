import { toInputDate } from "./month.js";

// Two expenses are "the same transaction" if they land on the same day, same amount
// (to the cent), and same note text — category/person can legitimately differ if a
// re-import guessed differently, so they're intentionally excluded from the signature.
export function expenseSignature(date, amount, note) {
  const d = toInputDate(date);
  const amt = Math.round((typeof amount === "number" ? amount : parseFloat(amount)) * 100);
  const n = String(note || "").trim().toLowerCase();
  return `${d}|${amt}|${n}`;
}

export function findDuplicateGroups(expenses, ignoredSignatures) {
  const ignored = ignoredSignatures instanceof Set ? ignoredSignatures : new Set(ignoredSignatures);
  const groups = new Map();
  for (const e of expenses) {
    const sig = expenseSignature(e.date, e.amount, e.note);
    if (ignored.has(sig)) continue;
    if (!groups.has(sig)) groups.set(sig, []);
    groups.get(sig).push(e);
  }
  return Array.from(groups.values()).filter((g) => g.length > 1);
}
