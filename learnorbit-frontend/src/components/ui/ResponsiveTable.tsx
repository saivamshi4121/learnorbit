"use client";
import React, { ReactNode } from "react";
import { TableSkeleton } from "./TableSkeleton";

/**
 * ResponsiveTable
 *
 * - On desktop (sm and up) it renders a classic grid‑like table with thin borders,
 *   rounded‑lg corners and the same surface background.
 * - On mobile (below sm) each row collapses into a minimal stacked card.
 * - While `loading` is true a skeleton placeholder is shown instead of the data.
 */
interface Column<T> {
  header: string;
  accessor: keyof T;
  /** optional render for custom cell content */
  render?: (value: unknown, row: T) => ReactNode;
}

interface ResponsiveTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  /** number of skeleton rows while loading */
  skeletonRows?: number;
}

export function ResponsiveTable<T extends { id: string | number }>(props: ResponsiveTableProps<T>) {
  const { columns, data, loading = false, skeletonRows = 4 } = props;

  if (loading) {
    return <TableSkeleton rows={skeletonRows} cols={columns.length} />;
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:grid grid-cols-[auto_1fr_auto] gap-0 border border-borderLight rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 font-medium text-gray-600 p-2 col-span-3 flex">
          {columns.map(col => (
            <div key={col.header} className="flex-1 px-2">
              {col.header}
            </div>
          ))}
        </div>
        {/* Rows */}
        {data.map(row => (
          <React.Fragment key={row.id}>
            {columns.map(col => (
              <div
                key={String(col.accessor)}
                className="border-t border-borderLight p-2 flex-1 px-2 text-sm text-gray-800"
              >
                {col.render ? col.render(row[col.accessor], row) : String(row[col.accessor])}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile stacked cards */}
      <div className="space-y-2 sm:hidden">
        {data.map(row => (
          <div
            key={row.id}
            className="border border-borderLight rounded-lg bg-surface p-4"
          >
            {columns.map(col => (
              <div key={col.header} className="mb-1">
                <span className="block text-xs text-mutedText mb-0.5">
                  {col.header}
                </span>
                <span className="block font-medium text-gray-900">
                  {col.render ? col.render(row[col.accessor], row) : String(row[col.accessor])}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
