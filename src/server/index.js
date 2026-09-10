import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { requireAuth } from "./middleware/auth.js";
import authRouter from "./routes/auth.js";
import expensesRouter from "./routes/expenses.js";
import incomeRouter from "./routes/income.js";
import settingsRouter from "./routes/settings.js";
import categoriesRouter from "./routes/categories.js";
import resetRouter from "./routes/reset.js";
import goalsRouter from "./routes/goals.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api", authRouter);

app.use("/api/expenses", requireAuth, expensesRouter);
app.use("/api/income", requireAuth, incomeRouter);
app.use("/api/settings", requireAuth, settingsRouter);
app.use("/api/categories", requireAuth, categoriesRouter);
app.use("/api/reset", requireAuth, resetRouter);
app.use("/api/goals", requireAuth, goalsRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Budget Raccoon API listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
