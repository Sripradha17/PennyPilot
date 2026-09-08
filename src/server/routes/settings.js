import { Router } from "express";
import Settings from "../models/Settings.js";

const router = Router();

async function getOrCreateSettings() {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
}

router.get("/", async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json(settings);
});

router.put("/", async (req, res) => {
  const settings = await getOrCreateSettings();
  const { currency, myLabel, spouseLabel, budgets } = req.body;
  if (currency !== undefined) settings.currency = currency;
  if (myLabel !== undefined) settings.myLabel = myLabel;
  if (spouseLabel !== undefined) settings.spouseLabel = spouseLabel;
  if (budgets !== undefined) settings.budgets = budgets;
  await settings.save();
  res.json(settings);
});

export default router;
