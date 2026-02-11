"use client";

/**
 * Simple loading skeleton that mimics a table row.
 * It uses the same border, rounding and background colors as the rest of the UI
 * to keep the visual identity consistent.
 */
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 p-4 border border-borderLight rounded-lg bg-surface animate-pulse"
        >
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 flex-1 bg-gray-200 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}
