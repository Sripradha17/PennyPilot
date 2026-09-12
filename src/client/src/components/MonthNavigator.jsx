import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMonth } from "../context/MonthContext.jsx";

export default function MonthNavigator() {
  const { label, isCurrentMonth, goToPrevMonth, goToNextMonth, goToCurrentMonth } = useMonth();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={goToPrevMonth}
        className="rounded-full bg-white/80 p-1.5 hover:bg-white transition"
        aria-label="Previous month"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="flex flex-col items-center min-w-[140px]">
        <span className="font-display font-bold text-lg leading-tight">{label}</span>
        {!isCurrentMonth && (
          <button
            onClick={goToCurrentMonth}
            className="text-xs text-ink/60 underline hover:text-ink"
          >
            jump to current month
          </button>
        )}
      </div>
      <button
        onClick={goToNextMonth}
        className="rounded-full bg-white/80 p-1.5 hover:bg-white transition"
        aria-label="Next month"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
