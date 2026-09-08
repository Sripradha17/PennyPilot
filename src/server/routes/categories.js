import { Router } from "express";
import Category from "../models/Category.js";

const router = Router();

router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

router.post("/", async (req, res) => {
  const { id, label, badgeColor } = req.body;
  const category = await Category.create({ id, label, badgeColor });
  res.status(201).json(category);
});

router.delete("/:id", async (req, res) => {
  await Category.findOneAndDelete({ id: req.params.id });
  res.status(204).end();
});

export default router;
