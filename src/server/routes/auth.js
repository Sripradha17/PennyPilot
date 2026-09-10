import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Household from "../models/Household.js";

const router = Router();

function signToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), householdId: user.householdId.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "90d" }
  );
}

// New account: gets its own brand-new, empty household — never joins an
// existing one automatically, so a stranger signing up never sees your data.
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) return res.status(409).json({ error: "An account with this email already exists" });

  const household = await Household.create({});
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email: normalizedEmail, passwordHash, householdId: household._id });

  res.status(201).json({ token: signToken(user) });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) return res.status(401).json({ error: "Incorrect email or password" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Incorrect email or password" });

  res.json({ token: signToken(user) });
});

export default router;
