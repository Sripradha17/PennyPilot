import { useState } from "react";
import { X, Upload, CheckCircle2 } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import { parseImportFile } from "../lib/importExcel.js";
import { toInputDate } from "../lib/month.js";

export default function ImportExpenses({ onClose }) {
  const { categories, bulkAddExpenses } = useData();
  const [parsed, setParsed] = useState(null);
  const [importing, setImporting] = useState(false);
  const [fileName, setFileName] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const result = await parseImportFile(file, categories);
    setParsed(result);
  }

  function toggleRow(key) {
    setParsed((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => (r.key === key ? { ...r, include: !r.include } : r)),
    }));
  }

  function updateCategory(key, category) {
    setParsed((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => (r.key === key ? { ...r, category } : r)),
    }));
  }

  async function handleImport() {
    const rowsToImport = parsed.rows.filter((r) => r.include && r.valid);
    if (rowsToImport.length === 0) return;
    setImporting(true);
    try {
      await bulkAddExpenses(
        rowsToImport.map((r) => ({
          date: r.date,
          category: r.category,
          amount: r.amount,
          note: r.note,
        }))
      );
      onClose();
    } finally {
      setImporting(false);
    }
  }

  const includedCount = parsed?.rows.filter((r) => r.include).length || 0;

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-soft w-full max-w-3xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-mist">
          <h2 className="font-bold text-lg">Import expenses</h2>
          <button onClick={onClose} className="text-ink/40 hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {!parsed && (
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-mist rounded-xl py-12 cursor-pointer hover:border-coral transition">
              <Upload size={28} className="text-ink/40" />
              <span className="text-sm text-ink/60">
                Click to choose an .xlsx, .xls, or .csv file
              </span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFile}
              />
            </label>
          )}

          {parsed && (
            <>
              <div className="flex items-center justify-between mb-3 text-sm">
                <span className="text-ink/60">{fileName}</span>
                <span className="flex items-center gap-1.5 text-teal font-medium">
                  <CheckCircle2 size={15} />
                  {parsed.parsedCount} parsed, {parsed.skippedCount} skipped
                </span>
              </div>
              {parsed.rows.length === 0 ? (
                <p className="text-ink/50 text-sm py-8 text-center">No rows found in file.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-ink/50 border-b border-mist">
                      <th className="py-2 pr-2 w-8"></th>
                      <th className="py-2 pr-2">Date</th>
                      <th className="py-2 pr-2">Category</th>
                      <th className="py-2 pr-2">Amount</th>
                      <th className="py-2 pr-2">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.rows.map((r) => (
                      <tr
                        key={r.key}
                        className={`border-b border-mist/60 ${!r.valid ? "opacity-40" : ""}`}
                      >
                        <td className="py-1.5 pr-2">
                          <input
                            type="checkbox"
                            checked={r.include}
                            disabled={!r.valid}
                            onChange={() => toggleRow(r.key)}
                          />
                        </td>
                        <td className="py-1.5 pr-2 whitespace-nowrap">
                          {r.date ? toInputDate(r.date) : "—"}
                        </td>
                        <td className="py-1.5 pr-2">
                          <select
                            value={r.category}
                            onChange={(e) => updateCategory(r.key, e.target.value)}
                            disabled={!r.valid}
                            className="rounded border border-mist px-1.5 py-1 text-xs"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-1.5 pr-2">{r.amount === "" ? "—" : r.amount}</td>
                        <td className="py-1.5 pr-2 truncate max-w-[160px]">{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>

        {parsed && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-mist">
            <span className="text-sm text-ink/60">{includedCount} rows selected</span>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="rounded-lg border border-mist text-sm font-medium px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={importing || includedCount === 0}
                className="rounded-lg bg-coral text-white text-sm font-medium px-4 py-2 hover:bg-coral/90 disabled:opacity-50"
              >
                Import {includedCount} rows
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
