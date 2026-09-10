import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: "Household", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
