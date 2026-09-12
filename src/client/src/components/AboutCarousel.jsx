import { useEffect, useState } from "react";

const SLIDES = [
  {
    image: "/art/raccoon-smile.png",
    eyebrow: "Monthly snapshot",
    title: "Spending overview",
    body: "A quick view of spending, goals, and upcoming categories.",
    metrics: ["Dining", "$830", "Groceries", "$485"],
    note: "Top categories update in one view.",
  },
  {
    image: "/art/raccoon-smile.png",
    eyebrow: "Alerts",
    title: "Change tracking",
    body: "Monitor categories that are rising faster than expected.",
    metrics: ["Savings", "+12%", "Bills", "Tomorrow"],
    note: "Early reminders help avoid missed payments.",
  },
  {
    image: "/art/raccoon-smile.png",
    eyebrow: "Goals",
    title: "Progress at a glance",
    body: "Track targets, recurring bills, and shared costs in one workspace.",
    metrics: ["Trip fund", "$640", "Shared rent", "On track"],
    note: "Goals stay visible without adding noise.",
  },
];

export default function AboutCarousel({ className = "", compact = false }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 3400);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];
  const shellClass = compact
    ? "rounded-[1.45rem] p-3.5 sm:rounded-[1.65rem] sm:p-4"
    : "rounded-[1.85rem] p-5";
  const imageClass = compact
    ? "h-24 w-24 sm:h-28 sm:w-28 lg:h-36 lg:w-36"
    : "h-32 w-32 lg:h-40 lg:w-40";

  return (
    <div className={`w-full max-w-md lg:max-w-xl ${className}`}>
      <div className={`relative overflow-hidden border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,244,251,0.96))] shadow-[0_30px_70px_-42px_rgba(67,54,87,0.38)] ${shellClass}`}>
        <div className="pointer-events-none absolute right-[-3rem] top-[-2rem] h-28 w-28 rounded-full bg-coral/20 blur-3xl" />
        <div className="pointer-events-none absolute left-[-2rem] bottom-[-2rem] h-28 w-28 rounded-full bg-[#cde4ff]/35 blur-3xl" />
        <div key={index} className="animate-slide-in text-left">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/88 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-coral shadow-[0_8px_20px_-18px_rgba(0,0,0,0.8)] sm:text-xs">
            <span className="h-2.5 w-2.5 rounded-full bg-coral" />
            {slide.eyebrow}
          </div>
          <div className="grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4">
            <div className="space-y-2">
              <p className="text-[1rem] font-extrabold leading-tight text-ink sm:text-[1.08rem] lg:text-[1.2rem]">{slide.title}</p>
              {!compact && (
                <p className="text-[12px] leading-5 text-ink/70 sm:text-[13px] lg:text-sm lg:leading-6">{slide.body}</p>
              )}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <MetricCard label={slide.metrics[0]} value={slide.metrics[1]} tone="warm" />
                <MetricCard label={slide.metrics[2]} value={slide.metrics[3]} tone="cool" />
              </div>
            </div>
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[1.7rem] bg-[linear-gradient(145deg,#fff0cf,#ffd8e7_58%,#dceaff)] sm:mx-0 sm:h-32 sm:w-32 lg:h-40 lg:w-40 lg:rounded-[2rem]">
              <img
                src={slide.image}
                alt="Budget Raccoon artwork"
                className={`object-contain drop-shadow-[0_18px_24px_rgba(104,71,115,0.18)] ${imageClass}`}
              />
            </div>
          </div>
          <div className="mt-3 rounded-[1.1rem] bg-white/78 px-3 py-2.5 text-[11px] leading-4 text-ink/62 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:text-[12px] sm:leading-5">
            {slide.note}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center gap-1.5 px-2 sm:mt-3 sm:justify-start">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Show feature ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-coral" : "w-2.5 bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function MetricCard({ label, value, tone }) {
  const toneClass = tone === "warm" ? "bg-[#fff5dc]" : "bg-[#e8f8f1]";

  return (
    <div className={`rounded-[1rem] ${toneClass} px-3 py-2.5`}>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink/45">{label}</p>
      <p className="mt-1 text-[1rem] font-extrabold leading-none text-ink sm:text-[1.1rem]">{value}</p>
    </div>
  );
}
