"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Columns3,
  Loader2,
  Plus,
  X,
} from "lucide-react";

export default function AddColumnButton({
  boardId,
}: {
  boardId: string;
}) {
  const router = useRouter();

  const [open, setOpen] =
    useState(false);
  const [title, setTitle] =
    useState("");
  const [loading, setLoading] =
    useState(false);

  async function handleSave() {
    if (!title.trim()) {
      alert(
        "Column name is required"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "/api/columns",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            boardId,
            title,
          }),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      setOpen(false);
      setTitle("");
      router.refresh();
    } catch {
      alert(
        "Failed to create column"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        className="inline-flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 text-sm font-medium text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
      >
        <Plus className="h-4 w-4" />
        Column
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
            {/* Header */}
            <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Board Setup
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-white">
                    Create Column
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Add a new stage
                    to your workflow.
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

            {/* Body */}
            <div className="px-6 py-6">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                <Columns3 className="h-4 w-4" />
                Column Name
              </label>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="e.g. Review, QA, Blocked"
                className="h-11 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-800 px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="h-11 rounded-2xl border border-slate-800 px-5 text-sm font-medium text-slate-300 transition hover:bg-slate-900"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleSave
                }
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 text-sm font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {loading
                  ? "Creating..."
                  : "Create Column"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}