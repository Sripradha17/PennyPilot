export function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function shiftMonth(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

export function isSameMonth(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() && dateA.getMonth() === dateB.getMonth()
  );
}

export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function toInputDate(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

// Parse a "YYYY-MM-DD" <input type="date"> value into a local-midnight Date, matching
// how the Excel importer builds dates. Sending the raw string instead would let the
// server's `new Date("YYYY-MM-DD")` cast interpret it as UTC midnight — a different
// instant that redisplays as the previous day in any timezone behind UTC.
export function fromInputDate(dateString) {
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(y, m - 1, d);
}
