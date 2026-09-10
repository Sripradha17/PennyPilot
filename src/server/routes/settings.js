import { Router } from "express";
import Settings from "../models/Settings.js";

const router = Router();

async function getOrCreateSettings(householdId) {
  let settings = await Settings.findOne({ householdId });
  if (!settings) {
    settings = await Settings.create({ householdId });
  }
  return settings;
}

router.get("/", async (req, res) => {
  const settings = await getOrCreateSettings(req.householdId);
  res.json(settings);
});

router.put("/", async (req, res) => {
  const settings = await getOrCreateSettings(req.householdId);
  const {
    currency,
    baseCurrencyCode,
    myLabel,
    spouseLabel,
    budgets,
    oneTimeBudgets,
    ignoredDuplicateSignatures,
    dismissedRecurringMonths,
  } = req.body;
  if (currency !== undefined) settings.currency = currency;
  if (baseCurrencyCode !== undefined) settings.baseCurrencyCode = baseCurrencyCode;
  if (myLabel !== undefined) settings.myLabel = myLabel;
  if (spouseLabel !== undefined) settings.spouseLabel = spouseLabel;
  if (budgets !== undefined) settings.budgets = budgets;
  if (oneTimeBudgets !== undefined) settings.oneTimeBudgets = oneTimeBudgets;
  if (ignoredDuplicateSignatures !== undefined) settings.ignoredDuplicateSignatures = ignoredDuplicateSignatures;
  if (dismissedRecurringMonths !== undefined) settings.dismissedRecurringMonths = dismissedRecurringMonths;
  await settings.save();
  res.json(settings);
});

export default router;
