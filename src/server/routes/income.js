import { Router } from "express";
import Income from "../models/Income.js";

const router = Router();

router.get("/", async (req, res) => {
  const income = await Income.find().sort({ date: -1 });
  res.json(income);
});

router.post("/", async (req, res) => {
  const { date, amount, person, note } = req.body;
  const income = await Income.create({ date, amount, person, note });
  res.status(201).json(income);
});

router.post("/bulk", async (req, res) => {
  const { rows } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: "rows must be a non-empty array" });
  }
  const docs = rows.map(({ date, amount, person, note }) => ({ date, amount, person, note }));
  const created = await Income.insertMany(docs);
  res.status(201).json(created);
});

router.delete("/:id", async (req, res) => {
  await Income.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
