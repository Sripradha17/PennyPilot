import * as XLSX from "xlsx";
import { findCategoryByName } from "./categories.js";

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

export async function parseImportFile(file, allCategories) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  if (rows.length === 0) {
    return { rows: [], columnsDetected: {}, parsedCount: 0, skippedCount: 0 };
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
    const matched = findCategoryByName(allCategories, categoryText);
    const note = noteCol ? String(row[noteCol] || "") : "";

    const valid = date !== null && !isNaN(amount);
    if (valid) parsedCount++;
    else skippedCount++;

    return {
      key: idx,
      include: valid,
      valid,
      date,
      amount: isNaN(amount) ? "" : amount,
      category: matched ? matched.id : "others",
      note,
      rawCategoryText: categoryText,
    };
  });

  return {
    rows: parsedRows,
    columnsDetected: { dateCol, categoryCol, amountCol, noteCol },
    parsedCount,
    skippedCount,
  };
}
