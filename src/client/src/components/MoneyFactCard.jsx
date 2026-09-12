import { useEffect, useState } from "react";
import { factForIndex } from "../lib/moneyFacts.js";

export default function MoneyFactCard({ className = "" }) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * 10));

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => i + 1), 9000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-white/75 bg-[linear-gradient(135deg,rgba(255,242,215,0.95),rgba(255,251,246,0.96),rgba(244,237,255,0.96))] p-4 shadow-soft ${className}`}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/20 blur-2xl" />
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 shrink-0 rounded-2xl bg-[linear-gradient(135deg,rgba(255,229,159,0.95),rgba(255,183,198,0.95))] shadow-[0_14px_20px_-18px_rgba(0,0,0,0.8)]" />
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-coral">Money fact</p>
          <p key={index} className="mt-1 text-sm text-ink/80 animate-page-in">
            {factForIndex(index)}
          </p>
        </div>
      </div>
    </div>
  );
}
