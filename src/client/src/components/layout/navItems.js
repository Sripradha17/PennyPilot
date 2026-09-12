import { Home, LayoutDashboard, Receipt, Wallet, Target, Flag, Landmark, Settings as SettingsIcon } from "lucide-react";

export const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "expenses", label: "Expenses", icon: Receipt },
  { id: "income", label: "Income", icon: Wallet },
  { id: "budgets", label: "Budget", icon: Target },
  { id: "goals", label: "Goals", icon: Flag },
  { id: "networth", label: "Net Worth", icon: Landmark },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

export const MOBILE_PRIMARY_IDS = ["home", "expenses", "budgets", "goals"];
