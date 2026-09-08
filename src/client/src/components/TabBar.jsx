import { LayoutDashboard, Receipt, Wallet, Target, Settings as SettingsIcon } from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "expenses", label: "Expenses", icon: Receipt },
  { id: "income", label: "Income", icon: Wallet },
  { id: "budgets", label: "Budgets", icon: Target },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

export default function TabBar({ active, onChange }) {
  return (
    <nav className="sticky top-[64px] sm:top-[60px] z-10 bg-cream border-b border-mist shadow-sm">
      <div className="max-w-5xl mx-auto flex overflow-x-auto">
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
    </nav>
  );
}
