Build a household finance tracker as a full-stack web app.

## Tech stack
- Frontend: Vite + React (functional components, hooks only), Tailwind CSS, lucide-react for icons
- Backend: Node.js + Express, with Mongoose connecting to MongoDB Atlas
- xlsx (SheetJS) on the frontend for both parsing imported Excel/CSV files and generating exported Excel files
- REST API between frontend and backend (no localStorage — all data lives in MongoDB Atlas)

## Project structure
- `/server` — Express + Mongoose API. Reads a `MONGODB_URI` connection string from a `.env` file (use dotenv; add `.env` to `.gitignore`).
- `/client` — Vite React app that talks to the server's API.
- Add npm scripts (or a root script using `concurrently`) so both can be started together in dev, and a README explaining how to plug in the MongoDB Atlas connection string and run the app.

## Data model (MongoDB collections)
- `expenses`: { date, category, amount, note }
- `income`: { date, amount, person ('mine' | 'spouse'), note }
- `settings`: a single document — { currency, myLabel, spouseLabel, budgets: { categoryId: number } }
- `categories`: only custom (user-created) categories — { id, label, badgeColor }. Built-in default categories are hardcoded in the frontend and don't need to live in the database.

## API endpoints
- `GET/POST/DELETE /api/expenses`, plus `POST /api/expenses/bulk` for importing many rows at once
- `GET/POST/DELETE /api/income`
- `GET/PUT /api/settings`
- `GET/POST/DELETE /api/categories`

## Core features

**Expenses**
- Form to log an expense: date, category (dropdown), amount, optional note.
- List of expenses for the currently viewed month, newest first, each deletable.
- A month navigator (prev/next arrows, "jump to current month" link) at the top. Every view — expenses, income, budget progress — filters to the selected month.

**Income**
- Form to log income: date, amount, optional note, and a toggle for who it belongs to. Default labels "Sripradha" and "Laksh," editable from settings.
- Totals shown per person and combined, for the selected month.

**Categories**
- Default categories: Rent, Provision, Utility, Gift, Grocery, Shopping, Eating Out, Travel, Transport, Health, Savings, Investment, Subscriptions, Personal, Others — each with its own icon and color.
- Let the user create custom categories from a settings screen (name only is enough; auto-assign an icon and color), and delete custom ones they created. Built-in categories can't be deleted.

**Budgets**
- A monthly budget amount per category, recurring every month (not set separately per month).
- For each category, a progress bar comparing this month's spend to its budget: green under ~80%, amber near the limit, red over budget.
- Treat Savings and Investment as "floor" goals rather than caps — exceeding the target is good news (show in green, e.g. "+$120 past goal"), not overspending.

**Import expenses from Excel/CSV**
- Upload an .xlsx, .xls, or .csv file of past expenses.
- Auto-detect Date, Category, Amount, and Note/Description columns from the header row, tolerating reasonable naming variations (e.g. "Cost," "Particulars," "Type").
- Match each row's category text against existing categories (built-in or custom) by name; default to "Others" if nothing matches.
- Show a review screen before importing anything: each row has a checkbox to include/exclude and an editable category dropdown, plus a summary of rows parsed vs. skipped (e.g. missing date or amount). Only the checked rows get sent to `POST /api/expenses/bulk`.

**Export monthly budget to Excel**
- A button (in the Budgets or Overview view) that exports the currently viewed month to a downloadable .xlsx file, generated client-side with SheetJS — no server round-trip needed since the data's already loaded.
- Include one sheet with a row per category: Category, Budgeted, Spent, Remaining (or Over), % Used.
- Include a summary section or second sheet with total income, total expenses, balance, and the income breakdown by person for that month.
- Name the file something like `budget-2026-06.xlsx` based on the viewed month.

**Settings**
- Editable currency symbol and the two income-person labels.
- "Reset all data," with a confirmation step, that deletes everything from MongoDB.

## Design
- Clean, mobile-friendly, single-page layout that works well on both desktop and phone widths.
- Sticky header with the month navigator and totals for income, expenses, and balance for the month in view.
- Pick a cohesive color palette and font pairing with some personality — avoid generic default Tailwind styling, but keep it readable and uncluttered.

## Deliverable
Scaffold both `/server` and `/client`, wire every CRUD action through the API (no local-only state that isn't backed by MongoDB), implement the Excel import and export features, and get everything running locally with clear instructions for where to put my MongoDB Atlas connection string.
