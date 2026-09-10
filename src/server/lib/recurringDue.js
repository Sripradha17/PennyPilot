// Server-side mirror of src/client/src/lib/recurring.js's template logic —
// duplicated rather than imported because the client lib pulls in browser
// date helpers; this only needs "is a recurring template due on this day".
export function normNote(note) {
  return String(note || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// The most recent isRecurring=true expense per note is the current template —
// later edits (amount changes) supersede older ones with the same note.
export function getRecurringTemplates(expenses) {
  const byNote = new Map();
  for (const e of expenses) {
    if (!e.isRecurring) continue;
    const key = normNote(e.note);
    if (!key) continue;
    const existing = byNote.get(key);
    if (!existing || new Date(e.date) > new Date(existing.date)) {
      byNote.set(key, e);
    }
  }
  return [...byNote.values()];
}
