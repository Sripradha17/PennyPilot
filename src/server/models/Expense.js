import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  note: { type: String, default: "" },
  person: { type: String, enum: ["mine", "spouse"], default: "mine" },
});

export default mongoose.model("Expense", expenseSchema);
