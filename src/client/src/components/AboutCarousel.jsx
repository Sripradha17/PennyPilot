import { useEffect, useState } from "react";
import { Repeat, Users, AlertTriangle, Target } from "lucide-react";

const SLIDES = [
  {
    icon: Repeat,
    title: "Never forget a bill",
    body: "Recurring bills and subscriptions add themselves to every month, automatically.",
  },
  {
    icon: Users,
    title: "One budget, shared",
    body: "Track who paid for what, together — no spreadsheets passed back and forth.",
  },
  {
    icon: AlertTriangle,
    title: "Catches duplicates",
    body: "Flags suspicious double-entries before they quietly wreck your numbers.",
  },
  {
    icon: Target,
    title: "Budgets that stick",
    body: "Set an allocation once — it carries forward every month until you change it.",
  },
];

export default function AboutCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 3400);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];
  const Icon = slide.icon;

  return (
    <div className="w-full max-w-xs">
      <div key={index} className="animate-slide-in text-center sm:text-left">
        <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-teal/15 text-teal mb-2">
          <Icon size={18} />
        </div>
        <p className="font-display font-bold text-base text-ink">{slide.title}</p>
        <p className="text-sm text-ink/60 mt-0.5">{slide.body}</p>
      </div>
      <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Show feature ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-5 bg-teal" : "w-1.5 bg-mist"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
