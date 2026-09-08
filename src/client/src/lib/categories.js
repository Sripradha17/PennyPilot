import {
  Home,
  ShoppingBasket,
  Lightbulb,
  Gift,
  ShoppingCart,
  Shirt,
  UtensilsCrossed,
  Plane,
  Bus,
  HeartPulse,
  PiggyBank,
  TrendingUp,
  Repeat,
  User,
  MoreHorizontal,
} from "lucide-react";

export const DEFAULT_CATEGORIES = [
  { id: "rent", label: "Rent", badgeColor: "#5b3a8e", icon: Home },
  { id: "provision", label: "Provision", badgeColor: "#1f7a6c", icon: ShoppingBasket },
  { id: "utility", label: "Utility", badgeColor: "#e8a23d", icon: Lightbulb },
  { id: "gift", label: "Gift", badgeColor: "#ff6b5e", icon: Gift },
  { id: "grocery", label: "Grocery", badgeColor: "#3f9142", icon: ShoppingCart },
  { id: "shopping", label: "Shopping", badgeColor: "#d6558c", icon: Shirt },
  { id: "eating-out", label: "Eating Out", badgeColor: "#e25c45", icon: UtensilsCrossed },
  { id: "travel", label: "Travel", badgeColor: "#2c8fbf", icon: Plane },
  { id: "transport", label: "Transport", badgeColor: "#4a6fa5", icon: Bus },
  { id: "health", label: "Health", badgeColor: "#c0392b", icon: HeartPulse },
  { id: "savings", label: "Savings", badgeColor: "#1f7a6c", icon: PiggyBank, isFloorGoal: true },
  { id: "investment", label: "Investment", badgeColor: "#2e7d32", icon: TrendingUp, isFloorGoal: true },
  { id: "subscriptions", label: "Subscriptions", badgeColor: "#8e44ad", icon: Repeat },
  { id: "personal", label: "Personal", badgeColor: "#e67e22", icon: User },
  { id: "others", label: "Others", badgeColor: "#7f8c8d", icon: MoreHorizontal },
];

const FALLBACK_COLORS = [
  "#ff6b5e", "#1f7a6c", "#e8a23d", "#5b3a8e", "#3f9142",
  "#2c8fbf", "#d6558c", "#c0392b", "#8e44ad", "#4a6fa5",
];

export function colorForNewCategory(existingCount) {
  return FALLBACK_COLORS[existingCount % FALLBACK_COLORS.length];
}

export function mergeCategories(customCategories) {
  const custom = customCategories.map((c) => ({ ...c, icon: MoreHorizontal, isCustom: true }));
  return [...DEFAULT_CATEGORIES, ...custom];
}

export function findCategoryByName(allCategories, name) {
  if (!name) return null;
  const normalized = name.trim().toLowerCase();
  return (
    allCategories.find((c) => c.label.toLowerCase() === normalized) ||
    allCategories.find((c) => c.id.toLowerCase() === normalized) ||
    null
  );
}
