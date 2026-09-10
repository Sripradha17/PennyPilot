import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema({
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: "Household", required: true, index: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["asset", "liability", "investment"], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Balance", balanceSchema);
