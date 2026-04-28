"use client";

import { useMemo, useState } from "react";
import {
  Filter,
  X,
  SlidersHorizontal,
} from "lucide-react";

type BoardFilterProps = {
  filter: string;
  setFilter: (value: string) => void;
  priority: string;
  setPriority: (
    value: string
  ) => void;
};

export default function BoardFilter({
  filter,
  setFilter,
  priority,
  setPriority,
}: BoardFilterProps) {
  const [open, setOpen] =
    useState(false);

  function clearFilters() {
    setFilter("all");
    setPriority("all");
    setOpen(false);
  }

  const activeCount =
    useMemo(() => {
      let count = 0;

      if (filter !== "all")
        count++;

      if (
        priority !== "all"
      )
        count++;

      return count;
    }, [filter, priority]);

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() =>
          setOpen(!open)
        }
        className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-4 text-sm font-medium text-white shadow-lg transition-all hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900"
      >
        <Filter className="h-4 w-4" />

        <span>Filters</span>

        {activeCount > 0 && (
          <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-1.5 text-[11px] font-semibold text-white">
            {activeCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
          {/* Header */}
          <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-slate-300">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Filters
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Refine visible
                  tasks
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-5 px-5 py-5">
            {/* Column */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Column
              </label>

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(
                    e.target.value
                  )
                }
                className="h-11 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 text-sm text-white outline-none transition focus:border-blue-500/60"
              >
                <option value="all">
                  All Columns
                </option>
                <option value="To Do">
                  To Do
                </option>
                <option value="Doing">
                  Doing
                </option>
                <option value="Done">
                  Done
                </option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Priority
              </label>

              <div className="grid grid-cols-2 gap-2">
                {[
                  "all",
                  "High",
                  "Medium",
                  "Low",
                ].map((item) => {
                  const active =
                    priority ===
                    item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setPriority(
                          item
                        )
                      }
                      className={`h-10 rounded-2xl border text-sm font-medium transition ${
                        active
                          ? "border-blue-500/40 bg-blue-500/15 text-blue-300"
                          : "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {item ===
                      "all"
                        ? "All"
                        : item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-xs text-slate-400">
              {activeCount === 0
                ? "No filters applied."
                : `${activeCount} active filter${
                    activeCount >
                    1
                      ? "s"
                      : ""
                  } applied.`}
            </div>

            {/* Actions */}
            <button
              type="button"
              onClick={
                clearFilters
              }
              className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}