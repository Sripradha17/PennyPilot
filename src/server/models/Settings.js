import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  currency: { type: String, default: "$" },
  myLabel: { type: String, default: "Sripradha" },
  spouseLabel: { type: String, default: "Laksh" },
  budgets: { type: Map, of: Number, default: {} },
});

export default mongoose.model("Settings", settingsSchema);
