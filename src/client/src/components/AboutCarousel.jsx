import { useEffect, useState } from "react";
import { Repeat, Users, Flag, Landmark, Sparkles, Globe2, Bell } from "lucide-react";

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
    icon: Flag,
    title: "Goals that show progress",
    body: "Set a savings target and watch it fill in as you go — linked to real spending.",
  },
  {
    icon: Landmark,
    title: "Net worth, no bank linking",
    body: "Calculated straight from your income and spending — nothing to connect, nothing to trust a third party with.",
  },
  {
    icon: Sparkles,
    title: "Spots the changes for you",
    body: "A monthly heads-up on what moved — which categories crept up or dropped since last month.",
  },
  {
    icon: Globe2,
    title: "Handles other currencies",
    body: "Paid in a different currency while traveling? Log it as-is — it converts automatically.",
  },
  {
    icon: Bell,
    title: "A nudge before it's due",
    body: "A push notification the day before a recurring bill hits, so nothing sneaks up on you.",
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
