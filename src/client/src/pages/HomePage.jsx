import { useMemo } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Receipt, Wallet, Target, Flag, BarChart3, ArrowRight } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import { useMonth } from "../context/MonthContext.jsx";
import { monthKey } from "../lib/month.js";
import { buildMonthlyTrends } from "../lib/trends.js";
import FinanceIllustration from "../components/illustrations/FinanceIllustration.jsx";
import Card from "../components/Card.jsx";

const QUICK_LINKS = [
  { to: "/overview", label: "Overview", description: "Get a clear picture of your finances", icon: LayoutDashboard, tone: "forest" },
  { to: "/expenses", label: "Expenses", description: "Track and analyze spending", icon: Receipt, tone: "coral" },
  { to: "/income", label: "Income", description: "Monitor incoming money", icon: Wallet, tone: "sky" },
  { to: "/budget", label: "Budget", description: "Manage monthly spending limits", icon: Target, tone: "gold" },
  { to: "/goals", label: "Goals", description: "Monitor savings progress", icon: Flag, tone: "plum" },
  { to: "/reports", label: "Reports", description: "Review financial trends", icon: BarChart3, tone: "teal" },
];

const TONE_CLASSES = {
  forest: "bg-forest/10 text-forest",
  coral: "bg-coral/10 text-[#c15a34]",
  sky: "bg-sky/15 text-[#2e6f96]",
  gold: "bg-gold/15 text-[#8A5F22]",
  plum: "bg-plum/15 text-[#7c5bab]",
  teal: "bg-teal/15 text-teal",
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  const { expenses, income, settings } = useData();
  const { selectedMonth, key } = useMonth();

  const trendData = useMemo(() => buildMonthlyTrends(expenses, income, selectedMonth, 6), [expenses, income, selectedMonth]);
  const monthExpenses = useMemo(() => expenses.filter((e) => monthKey(new Date(e.date)) === key), [expenses, key]);
  const monthIncome = useMemo(() => income.filter((i) => monthKey(new Date(i.date)) === key), [income, key]);
  const currentBalance = trendData[trendData.length - 1]?.balance ?? monthIncome.reduce((s, i) => s + i.amount, 0) - monthExpenses.reduce((s, e) => s + e.amount, 0);
  const fmt = (n) => `${settings.currency}${Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[1.75rem] border border-white/75 bg-surface shadow-soft">
        <FinanceIllustration type="home" size={220} />
        <div className="p-5 sm:p-7">
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-[1.7rem]">
            {greeting()}, {settings.myLabel}
          </h1>
          <p className="mt-1.5 max-w-md text-sm text-ink/60">
            Here's your budgeting home base — jump into any section below to track spending, plan
            budgets, and keep your savings goals on course.
          </p>
          <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.2em] text-ink/40">Safe to spend this month</p>
          <p className={`font-display text-3xl font-extrabold tabular-nums ${currentBalance < 0 ? "text-coral" : "text-forest"}`}>
            {currentBalance < 0 ? "-" : ""}
            {fmt(currentBalance)}
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-ink">Explore your finances</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map(({ to, label, description, icon: Icon, tone }, idx) => (
            <Link key={to} to={to} className="block animate-page-in" style={{ animationDelay: `${idx * 40}ms` }}>
              <Card className="group h-full hover:-translate-y-0.5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${TONE_CLASSES[tone]}`}>
                  <Icon size={18} />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <h3 className="font-display text-base font-bold text-ink">{label}</h3>
                  <ArrowRight size={16} className="text-ink/25 transition-transform group-hover:translate-x-0.5 group-hover:text-ink/50" />
                </div>
                <p className="mt-1 text-sm text-ink/55">{description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
