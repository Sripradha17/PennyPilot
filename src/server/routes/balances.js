import { Router } from "express";
import Balance from "../models/Balance.js";

const router = Router();

router.get("/", async (req, res) => {
  const balances = await Balance.find({ householdId: req.householdId }).sort({ date: -1 });
  res.json(balances);
});

router.post("/", async (req, res) => {
  const { name, type, amount, date } = req.body;
  const balance = await Balance.create({ name, type, amount, date, householdId: req.householdId });
  res.status(201).json(balance);
});

router.delete("/:id", async (req, res) => {
  await Balance.findOneAndDelete({ _id: req.params.id, householdId: req.householdId });
  res.status(204).end();
});

export default router;
