import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: "Household", required: true, index: true },
  date: { type: Date, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  note: { type: String, default: "" },
  person: { type: String, enum: ["mine", "spouse"], default: "mine" },
  isRecurring: { type: Boolean, default: false },
});

export default mongoose.model("Expense", expenseSchema);
