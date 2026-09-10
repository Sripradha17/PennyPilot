import { Router } from "express";
import PushSubscription from "../models/PushSubscription.js";

const router = Router();

router.post("/subscribe", async (req, res) => {
  const { subscription } = req.body;
  if (!subscription?.endpoint) return res.status(400).json({ error: "Invalid subscription" });

  const existing = await PushSubscription.findOne({ "subscription.endpoint": subscription.endpoint });
  if (existing) {
    existing.householdId = req.householdId;
    existing.subscription = subscription;
    await existing.save();
  } else {
    await PushSubscription.create({ householdId: req.householdId, subscription });
  }
  res.status(201).json({ ok: true });
});

router.post("/unsubscribe", async (req, res) => {
  const { endpoint } = req.body;
  if (endpoint) await PushSubscription.deleteOne({ "subscription.endpoint": endpoint });
  res.status(204).end();
});

export default router;
