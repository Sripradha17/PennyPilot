import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  badgeColor: { type: String, required: true },
});

export default mongoose.model("Category", categorySchema);
