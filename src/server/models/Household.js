import mongoose from "mongoose";

// A household is just a data-ownership boundary — everyone in it sees the
// same shared expenses/income/budgets. A new signup gets its own fresh,
// empty household; the two founding accounts share one pre-existing household.
const householdSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Household", householdSchema);
