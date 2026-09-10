import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  currency: { type: String, default: "$" },
  myLabel: { type: String, default: "Sripradha" },
  spouseLabel: { type: String, default: "Sudheendra" },
  budgets: { type: Map, of: Number, default: {} },
  // One-off budgets that apply only to a specific month, keyed "YYYY-MM:categoryId".
  // Falls back to `budgets` (the recurring monthly amount) when no override exists.
  oneTimeBudgets: { type: Map, of: Number, default: {} },
  // Duplicate signatures ("date|amountInCents|note") the user has confirmed are
  // legitimate separate transactions, so the duplicate finder stops flagging them.
  ignoredDuplicateSignatures: { type: [String], default: [] },
  // Months ("YYYY-MM") where the user dismissed the "add missing recurring
  // transactions" prompt, so it doesn't keep reappearing for that month.
  dismissedRecurringMonths: { type: [String], default: [] },
});

export default mongoose.model("Settings", settingsSchema);
