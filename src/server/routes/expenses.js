import { Router } from "express";
import Expense from "../models/Expense.js";

const router = Router();

router.get("/", async (req, res) => {
  const expenses = await Expense.find().sort({ date: -1 });
  res.json(expenses);
});

router.post("/", async (req, res) => {
  const { date, category, amount, note } = req.body;
  const expense = await Expense.create({ date, category, amount, note });
  res.status(201).json(expense);
});

router.post("/bulk", async (req, res) => {
  const { rows } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: "rows must be a non-empty array" });
  }
  const docs = rows.map(({ date, category, amount, note }) => ({
    date,
    category,
    amount,
    note,
  }));
  const created = await Expense.insertMany(docs);
  res.status(201).json(created);
});

router.delete("/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
