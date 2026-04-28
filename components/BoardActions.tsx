"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Trash2,
  MoreHorizontal,
  FolderPen,
} from "lucide-react";

export default function BoardActions({
  board,
}: {
  board: any;
}) {
  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [title, setTitle] =
    useState(board.title);

  const [loading, setLoading] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  async function handleRename() {
    if (!title.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(
        `/api/boards/${board.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title,
          }),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      setEditing(false);
      setOpen(false);
      router.refresh();
    } catch {
      alert(
        "Rename failed"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const ok = confirm(
      "Delete this board?"
    );

    if (!ok) return;

    try {
      setDeleting(true);

      const res = await fetch(
        `/api/boards/${board.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      router.refresh();
    } catch {
      alert(
        "Delete failed"
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {/* Trigger */}
      <div className="relative">
        <button
          type="button"
          onClick={() =>
            setOpen(!open)
          }
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-12 z-50 w-48 rounded-2xl border border-border bg-card p-2 shadow-xl">
            <button
              type="button"
              onClick={() => {
                setEditing(true);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-muted"
            >
              <Pencil className="h-4 w-4 text-blue-500" />
              Rename
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 transition hover:bg-muted disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {deleting
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        )}
      </div>

      {/* Rename Modal */}
      {editing && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white">
                <FolderPen className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Rename Board
                </h2>

                <p className="text-sm text-muted-foreground">
                  Update your board title
                </p>
              </div>
            </div>

            <input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="Board title"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setEditing(false)
                }
                className="rounded-2xl border border-border px-4 py-2 hover:bg-muted"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRename}
                disabled={loading}
                className="rounded-2xl bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}