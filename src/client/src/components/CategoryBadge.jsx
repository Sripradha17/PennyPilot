import { MoreHorizontal } from "lucide-react";

export default function CategoryBadge({ category }) {
  if (!category) return null;
  const Icon = category.icon || MoreHorizontal;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-white"
      style={{ backgroundColor: category.badgeColor }}
    >
      <Icon size={13} />
      {category.label}
    </span>
  );
}
