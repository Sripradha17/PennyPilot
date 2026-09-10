import * as XLSX from "xlsx";
import { findCategoryByNameExact, colorForNewCategory } from "./categories.js";
import { monthKey as computeMonthKey } from "./month.js";

const DATE_HEADERS = ["date", "transaction date", "txn date"];
const CATEGORY_HEADERS = ["category", "type", "particulars"];
const AMOUNT_HEADERS = ["amount", "cost", "price", "value"];
const NOTE_HEADERS = ["note", "notes", "description", "particulars", "details", "remarks"];

function normalizeHeader(h) {
  return String(h || "").trim().toLowerCase();
}

function findColumn(headers, candidates) {
  const normalized = headers.map(normalizeHeader);
  for (const candidate of candidates) {
    const idx = normalized.indexOf(candidate);
    if (idx !== -1) return headers[idx];
  }
  for (const candidate of candidates) {
    const idx = normalized.findIndex((h) => h.includes(candidate));
    if (idx !== -1) return headers[idx];
  }
  return null;
}

function parseDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === "number") {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed) return new Date(parsed.y, parsed.m - 1, parsed.d);
  }
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

// --- Plain flat sheet (one table, one header row): Date/Category/Amount/Note columns ---
function parseFlatSheet(workbook, categories, settings) {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  if (rows.length === 0) {
    return { template: false, rows: [], parsedCount: 0, skippedCount: 0 };
  }

  const headers = Object.keys(rows[0]);
  const dateCol = findColumn(headers, DATE_HEADERS);
  const categoryCol = findColumn(headers, CATEGORY_HEADERS);
  const amountCol = findColumn(headers, AMOUNT_HEADERS);
  const noteCol = findColumn(headers, NOTE_HEADERS);

  let parsedCount = 0;
  let skippedCount = 0;

  const parsedRows = rows.map((row, idx) => {
    const rawDate = dateCol ? row[dateCol] : null;
    const rawAmount = amountCol ? row[amountCol] : null;
    const date = parseDate(rawDate);
    const amount = parseFloat(rawAmount);
    const categoryText = categoryCol ? String(row[categoryCol] || "") : "";
    const matched = findCategoryByNameExact(categories, categoryText);
    const note = noteCol ? String(row[noteCol] || "") : "";

    const valid = date !== null && !isNaN(amount);
    if (valid) parsedCount++;
    else skippedCount++;

    return {
      key: `flat-${idx}`,
      include: valid,
      valid,
      date,
      amount: isNaN(amount) ? "" : amount,
      category: matched ? matched.id : "others",
      note,
      rawCategoryText: categoryText,
      person: matchPerson(note, settings),
    };
  });

  return { template: false, rows: parsedRows, parsedCount, skippedCount };
}

// --- "Monthly Budget" template: one "<Month> Transactions" sheet per month, each with a
// side-by-side Expenses table and Income table, plus a paired "<Month> Summary" sheet
// holding a Planned-budget-per-category table. ---

const HEADER_SCAN_ROWS = 10;

function normCell(v) {
  return String(v ?? "").trim().toLowerCase();
}

function sheetToAOA(sheet) {
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: true });
}

function findTransactionBlocks(aoa) {
  for (let r = 0; r < Math.min(HEADER_SCAN_ROWS, aoa.length); r++) {
    const row = aoa[r];
    const dateStartCols = [];
    for (let c = 0; c < row.length; c++) {
      if (normCell(row[c]) === "date" && normCell(row[c + 1]) === "amount") {
        dateStartCols.push(c);
      }
    }
    if (dateStartCols.length === 0) continue;

    const labelCols = {};
    for (let lr = Math.max(0, r - 6); lr < r; lr++) {
      (aoa[lr] || []).forEach((cell, c) => {
        const n = normCell(cell);
        if (n === "expenses" || n === "expense") labelCols[c] = "expense";
        if (n === "income") labelCols[c] = "income";
      });
    }

    const blocks = dateStartCols.map((startCol, i) => {
      const endCol = i + 1 < dateStartCols.length ? dateStartCols[i + 1] : row.length;
      const cols = { date: startCol, amount: startCol + 1 };
      for (let c = startCol; c < endCol; c++) {
        const n = normCell(row[c]);
        if (n === "description") cols.description = c;
        else if (n === "category") cols.category = c;
        else if (n === "notes" || n === "note") cols.notes = c;
      }
      let kind = null;
      let bestCol = -1;
      for (const [colStr, k] of Object.entries(labelCols)) {
        const col = Number(colStr);
        if (col <= startCol + 1 && col > bestCol) {
          bestCol = col;
          kind = k;
        }
      }
      if (!kind) kind = i === 0 ? "expense" : "income";
      return { startCol, endCol, cols, kind };
    });

    return { headerRowIdx: r, blocks };
  }
  return null;
}

function parseBudgetPlansFromSummary(aoa) {
  let plannedHeaderRow = -1;
  let plannedCol = -1;
  for (let r = 0; r < aoa.length; r++) {
    const row = aoa[r];
    for (let c = 0; c < row.length; c++) {
      if (
        normCell(row[c]) === "planned" &&
        normCell(row[c + 1]) === "actual" &&
        normCell(row[c + 2]).startsWith("diff")
      ) {
        plannedHeaderRow = r;
        plannedCol = c;
        break;
      }
    }
    if (plannedHeaderRow !== -1) break;
  }
  if (plannedHeaderRow === -1) return [];

  let totalsRow = -1;
  let nameCol = -1;
  for (let r = plannedHeaderRow + 1; r < Math.min(plannedHeaderRow + 4, aoa.length); r++) {
    const row = aoa[r];
    for (let c = 0; c < plannedCol; c++) {
      if (normCell(row[c]) === "totals") {
        totalsRow = r;
        nameCol = c;
        break;
      }
    }
    if (totalsRow !== -1) break;
  }
  if (totalsRow === -1) return [];

  let start = totalsRow + 1;
  while (start < aoa.length && normCell((aoa[start] || [])[nameCol]) === "") start++;

  const plans = [];
  for (let r = start; r < aoa.length; r++) {
    const row = aoa[r];
    const name = row[nameCol];
    if (normCell(name) === "") break;
    const planned = row[plannedCol];
    plans.push({
      categoryText: String(name).trim(),
      planned: typeof planned === "number" ? planned : parseFloat(planned) || 0,
    });
  }
  return plans;
}

function detectMonthlyBudgetTemplate(workbook) {
  const months = [];
  for (const sheetName of workbook.SheetNames) {
    const match = sheetName.match(/^(.*?)\s+transactions$/i);
    if (!match) continue;
    const monthLabel = match[1].trim();
    if (/^adulting/i.test(monthLabel)) continue; // different shape (investment contributions log)

    const aoa = sheetToAOA(workbook.Sheets[sheetName]);
    const detected = findTransactionBlocks(aoa);
    if (!detected) continue;

    const summarySheetName = workbook.SheetNames.find(
      (n) => n.toLowerCase() === `${monthLabel} summary`.toLowerCase()
    );

    months.push({ monthLabel, sheetName, aoa, detected, summarySheetName });
  }
  return months.length > 0 ? months : null;
}

function parseMonthlyBudgetTemplate(workbook, months, categories, settings) {
  const expenseRows = [];
  const incomeRows = [];
  const budgetPlansByText = new Map(); // categoryText -> { planned, month } (last month wins)
  const monthKeyByLabel = new Map(); // monthLabel -> "YYYY-MM", from the first dated row seen

  for (const { monthLabel, aoa, detected, summarySheetName } of months) {
    const { headerRowIdx, blocks } = detected;

    for (let r = headerRowIdx + 1; r < aoa.length; r++) {
      const row = aoa[r];
      for (const block of blocks) {
        const rawDate = row[block.cols.date];
        const rawAmount = row[block.cols.amount];
        if (normCell(rawDate) === "" && normCell(rawAmount) === "") continue;

        const date = parseDate(rawDate);
        const amount = typeof rawAmount === "number" ? rawAmount : parseFloat(rawAmount);
        const valid = date !== null && !isNaN(amount);
        if (valid && !monthKeyByLabel.has(monthLabel)) {
          monthKeyByLabel.set(monthLabel, computeMonthKey(date));
        }
        const description =
          block.cols.description !== undefined ? String(row[block.cols.description] ?? "") : "";
        const notes = block.cols.notes !== undefined ? String(row[block.cols.notes] ?? "") : "";
        const categoryText =
          block.cols.category !== undefined ? String(row[block.cols.category] ?? "") : "";

        if (block.kind === "expense") {
          const matched = findCategoryByNameExact(categories, categoryText);
          expenseRows.push({
            key: `exp-${monthLabel}-${r}`,
            month: monthLabel,
            include: valid,
            valid,
            date,
            amount: isNaN(amount) ? "" : amount,
            note: [description, notes].filter(Boolean).join(" — "),
            rawCategoryText: categoryText,
            category: matched ? matched.id : null,
            person: matchPerson(description, settings),
          });
        } else {
          const personText = [description, categoryText].filter(Boolean).join(" ");
          incomeRows.push({
            key: `inc-${monthLabel}-${r}`,
            month: monthLabel,
            include: valid,
            valid,
            date,
            amount: isNaN(amount) ? "" : amount,
            note: description,
            rawText: personText,
            person: matchPerson(personText, settings),
          });
        }
      }
    }

    if (summarySheetName) {
      const summaryAoa = sheetToAOA(workbook.Sheets[summarySheetName]);
      for (const plan of parseBudgetPlansFromSummary(summaryAoa)) {
        if (!plan.planned) continue; // skip unused template placeholder rows (planned 0)
        budgetPlansByText.set(plan.categoryText, { planned: plan.planned, month: monthLabel });
      }
    }
  }

  const budgetRows = Array.from(budgetPlansByText.entries()).map(([categoryText, v], idx) => {
    const matched = findCategoryByNameExact(categories, categoryText);
    return {
      key: `bud-${idx}`,
      include: true,
      categoryText,
      planned: v.planned,
      month: v.month,
      monthKey: monthKeyByLabel.get(v.month) || null,
      category: matched ? matched.id : null,
    };
  });

  const monthLabels = months.map((m) => m.monthLabel);
  const parsedCount = expenseRows.filter((r) => r.valid).length;
  const skippedCount = expenseRows.filter((r) => !r.valid).length;

  return {
    template: true,
    months: monthLabels,
    expenseRows,
    incomeRows,
    budgetRows,
    parsedCount,
    skippedCount,
  };
}

function matchPerson(text, settings) {
  const normalized = normCell(text);
  if (!normalized) return null;
  const myFirst = normCell((settings?.myLabel || "").split(/\s+/)[0]);
  const spouseFirst = normCell((settings?.spouseLabel || "").split(/\s+/)[0]);

  const tokens = normalized.split(/[^a-z0-9]+/).filter((t) => t.length >= 3);
  const tokenMatches = (label) =>
    label.length >= 3 && tokens.some((t) => t.startsWith(label) || label.startsWith(t));

  if (myFirst && tokenMatches(myFirst)) return "mine";
  if (spouseFirst && tokenMatches(spouseFirst)) return "spouse";
  return null;
}

// Generates a slug/color pair for a category text that didn't match an existing category,
// so the caller can offer "create new category" for it during import review.
export function suggestCategoryFor(text, existingCount) {
  const id = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return { id, label: text.trim(), badgeColor: colorForNewCategory(existingCount) };
}

export async function parseImportFile(file, categories, settings) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });

  const months = detectMonthlyBudgetTemplate(workbook);
  if (months) return parseMonthlyBudgetTemplate(workbook, months, categories, settings);

  return parseFlatSheet(workbook, categories, settings);
}
