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

router.delete("/:id", async (req, res) => {
  await Income.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
