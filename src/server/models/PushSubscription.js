import mongoose from "mongoose";

const pushSubscriptionSchema = new mongoose.Schema({
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: "Household", required: true, index: true },
  subscription: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("PushSubscription", pushSubscriptionSchema);
