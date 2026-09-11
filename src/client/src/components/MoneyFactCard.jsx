import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { factForIndex } from "../lib/moneyFacts.js";

// A floating "insight" bubble in the spirit of a real finance app's callout
// cards — a small rotating fact, not just another number.
export default function MoneyFactCard({ className = "" }) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * 10));

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => i + 1), 9000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/[0.09] via-surface to-surface p-4 shadow-soft ${className}`}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gold/10 blur-2xl" />
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gold/15 text-gold shrink-0">
          <Sparkles size={16} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-gold uppercase tracking-wide">Money fact</p>
          <p key={index} className="text-sm text-ink/80 mt-0.5 animate-page-in">
            {factForIndex(index)}
          </p>
        </div>
      </div>
    </div>
  );
}
