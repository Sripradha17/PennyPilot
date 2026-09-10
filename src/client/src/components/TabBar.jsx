import { useEffect, useRef, useState } from "react";
import { LayoutDashboard, Receipt, Wallet, Target, Settings as SettingsIcon } from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "expenses", label: "Expenses", icon: Receipt },
  { id: "income", label: "Income", icon: Wallet },
  { id: "budgets", label: "Budgets", icon: Target },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

export default function TabBar({ active, onChange }) {
  const scrollRef = useRef(null);
  const [canScrollMore, setCanScrollMore] = useState(false);

  function updateFade() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollMore(el.scrollWidth - el.scrollLeft - el.clientWidth > 4);
  }

  useEffect(() => {
    updateFade();
    window.addEventListener("resize", updateFade);
    return () => window.removeEventListener("resize", updateFade);
  }, []);

  return (
    <nav className="sticky top-[64px] sm:top-[60px] z-10 bg-surface border-b border-mist shadow-sm">
      <div
        ref={scrollRef}
        onScroll={updateFade}
        className="max-w-5xl mx-auto flex overflow-x-auto"
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                isActive
                  ? "border-coral text-coral"
                  : "border-transparent text-ink/60 hover:text-ink"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>
      {canScrollMore && (
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-surface to-transparent" />
      )}
    </nav>
  );
}
