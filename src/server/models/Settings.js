import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  householdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Household",
    required: true,
    unique: true,
  },
  currency: { type: String, default: "$" },
  // 3-letter code (e.g. "USD") the household's `amount` fields are always
  // stored in — needed to convert a foreign-currency entry into that amount.
  baseCurrencyCode: { type: String, default: "USD" },
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
