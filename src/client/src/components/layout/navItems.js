import { Home, LayoutDashboard, Receipt, Wallet, Target, Flag, BarChart3, Settings as SettingsIcon } from "lucide-react";

export const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/overview" },
  { id: "expenses", label: "Expenses", icon: Receipt, path: "/expenses" },
  { id: "income", label: "Income", icon: Wallet, path: "/income" },
  { id: "budget", label: "Budget", icon: Target, path: "/budget" },
  { id: "goals", label: "Goals", icon: Flag, path: "/goals" },
  { id: "reports", label: "Reports", icon: BarChart3, path: "/reports" },
  { id: "settings", label: "Settings", icon: SettingsIcon, path: "/settings" },
];

// Bottom nav shows these directly; everything else lives behind "More".
export const MOBILE_PRIMARY_IDS = ["home", "expenses", "budget", "goals"];
export const MOBILE_MORE_IDS = ["income", "reports", "settings"];
