import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  note: { type: String, default: "" },
});

export default mongoose.model("Expense", expenseSchema);
