import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (total === 0 || totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  return (
    <div className="flex items-center justify-between pt-3 mt-1 border-t border-mist text-xs text-ink/50">
      <span>
        {start}–{end} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="flex items-center justify-center rounded-lg border border-mist p-1.5 disabled:opacity-30 hover:bg-mist/50"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="px-2 whitespace-nowrap">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="flex items-center justify-center rounded-lg border border-mist p-1.5 disabled:opacity-30 hover:bg-mist/50"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
