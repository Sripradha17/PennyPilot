# PennyPilot

A household finance tracker — log expenses and income, set monthly category budgets, import
past expenses from Excel/CSV, and export a monthly budget report. Data lives in MongoDB Atlas
(no localStorage).

## Stack

- **Client** (`src/client`): Vite + React, Tailwind CSS, lucide-react icons, SheetJS (`xlsx`)
  for import/export.
- **Server** (`src/server`): Express + Mongoose REST API.

## Setup

1. **MongoDB Atlas connection string** — put it in the `.env` file at the project root:

   ```
   MONGODB_URI="mongodb+srv://<user>:<password>@<cluster-url>/pennypilot?retryWrites=true&w=majority"
   PORT=5000
   ```

   (A `.env` with Atlas credentials already exists at the project root — just make sure
   `MONGODB_URI` is set there. It's git-ignored.)

2. **Install dependencies** (run once from the project root):

   ```bash
   npm install
   npm run install:client
   ```

3. **Run both client and server together in dev mode:**

   ```bash
   npm run dev
   ```

   - API runs on `http://localhost:5000`
   - Client runs on `http://localhost:5173` and proxies `/api/*` to the server.

## Project structure

```
src/
  server/        Express + Mongoose API
    models/      Expense, Income, Category, Settings schemas
    routes/      /api/expenses, /api/income, /api/categories, /api/settings, /api/reset
    db.js        Mongo connection
    index.js     App entry point
  client/        Vite React app
    src/
      pages/         Overview, Expenses, Income, Budgets, Settings
      components/    Header, MonthNavigator, TabBar, ImportExpenses, etc.
      context/       DataContext (API-backed state), MonthContext (selected month)
      lib/           api client, category constants, Excel import/export helpers
```

## Features

- **Expenses & Income** — log, list, and delete entries, filtered by the currently viewed month.
- **Budgets** — recurring monthly budget per category with a progress bar (green/amber/red).
  Savings and Investment are treated as floor goals — exceeding them is shown as good news.
- **Import** — upload an .xlsx/.xls/.csv file, auto-detect Date/Category/Amount/Note columns,
  review and edit each row before importing.
- **Export** — download the currently viewed month as an .xlsx file with a budget breakdown and
  income/expense summary.
- **Settings** — currency symbol, income-person labels, custom categories, and a "reset all data"
  option.
