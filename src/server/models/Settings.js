import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  currency: { type: String, default: "$" },
  myLabel: { type: String, default: "Sripradha" },
  spouseLabel: { type: String, default: "Sudheendra" },
  budgets: { type: Map, of: Number, default: {} },
  // One-off budgets that apply only to a specific month, keyed "YYYY-MM:categoryId".
  // Falls back to `budgets` (the recurring monthly amount) when no override exists.
  oneTimeBudgets: { type: Map, of: Number, default: {} },
});

export default mongoose.model("Settings", settingsSchema);
