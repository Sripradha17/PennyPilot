import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import expensesRouter from "./routes/expenses.js";
import incomeRouter from "./routes/income.js";
import settingsRouter from "./routes/settings.js";
import categoriesRouter from "./routes/categories.js";
import resetRouter from "./routes/reset.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/expenses", expensesRouter);
app.use("/api/income", incomeRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/reset", resetRouter);

app.get("/api/health", (req, res) => res.json({ ok: true }));

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`PennyPilot API listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
