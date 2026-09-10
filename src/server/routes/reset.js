import { Router } from "express";
import Expense from "../models/Expense.js";
import Income from "../models/Income.js";
import Category from "../models/Category.js";
import Settings from "../models/Settings.js";

const router = Router();

router.post("/", async (req, res) => {
  const householdId = req.householdId;
  await Promise.all([
    Expense.deleteMany({ householdId }),
    Income.deleteMany({ householdId }),
    Category.deleteMany({ householdId }),
    Settings.deleteMany({ householdId }),
  ]);
  res.status(204).end();
});

export default router;
