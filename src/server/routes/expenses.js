import { Router } from "express";
import Expense from "../models/Expense.js";

const router = Router();

router.get("/", async (req, res) => {
  const expenses = await Expense.find({ householdId: req.householdId }).sort({ date: -1 });
  res.json(expenses);
});

router.post("/", async (req, res) => {
  const { date, category, amount, note, person, isRecurring } = req.body;
  const expense = await Expense.create({
    date,
    category,
    amount,
    note,
    person,
    isRecurring,
    householdId: req.householdId,
  });
  res.status(201).json(expense);
});

router.post("/bulk", async (req, res) => {
  const { rows } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: "rows must be a non-empty array" });
  }
  const docs = rows.map(({ date, category, amount, note, person, isRecurring }) => ({
    date,
    category,
    amount,
    note,
    person,
    isRecurring,
    householdId: req.householdId,
  }));
  const created = await Expense.insertMany(docs);
  res.status(201).json(created);
});

router.put("/:id", async (req, res) => {
  const { date, category, amount, note, person, isRecurring } = req.body;
  const update = {};
  if (date !== undefined) update.date = date;
  if (category !== undefined) update.category = category;
  if (amount !== undefined) update.amount = amount;
  if (note !== undefined) update.note = note;
  if (person !== undefined) update.person = person;
  if (isRecurring !== undefined) update.isRecurring = isRecurring;
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, householdId: req.householdId },
    update,
    { new: true }
  );
  if (!expense) return res.status(404).json({ error: "Expense not found" });
  res.json(expense);
});

router.delete("/:id", async (req, res) => {
  await Expense.findOneAndDelete({ _id: req.params.id, householdId: req.householdId });
  res.status(204).end();
});

export default router;
