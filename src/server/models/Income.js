import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: "Household", required: true, index: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  person: { type: String, enum: ["mine", "spouse"], required: true },
  note: { type: String, default: "" },
});

export default mongoose.model("Income", incomeSchema);
