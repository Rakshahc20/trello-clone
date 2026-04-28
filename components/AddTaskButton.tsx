"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  X,
  Calendar,
  Flag,
  Loader2,
} from "lucide-react";

type AddTaskButtonProps = {
  columnId: string;
  columnTitle: string;
};

export default function AddTaskButton({
  columnId,
  columnTitle,
}: AddTaskButtonProps) {
  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [priority, setPriority] =
    useState("Medium");

  const [dueDate, setDueDate] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSave() {
    if (!title.trim()) {
      alert("Task title is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "/api/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            columnId,
            title,
            description,
            priority,
            due_date:
              dueDate || null,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            "Failed to save task"
        );
        return;
      }

      setOpen(false);
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate("");

      router.refresh();
    } catch {
      alert("Something went wrong");
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
        className="inline-flex h-10 items-center gap-2 rounded-2xl border border-border bg-card px-3 text-sm font-medium text-foreground shadow-sm transition hover:scale-[1.02]"
      >
        <Plus className="h-4 w-4" />
        Task
      </button>

      {/* Modal */}
      {mounted && open && (
        <div className="fixed inset-0 z-[99999] isolate flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative z-[100000] w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-background shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  New Task
                </p>

                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  Add task to {columnTitle}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Create a new task and keep work organized.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-xl border border-border p-2 transition hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 px-6 py-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Title
                </label>

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                  placeholder="Enter task title"
                  className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={
                    description
                  }
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Write task details..."
                  className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <Flag className="h-4 w-4" />
                    Priority
                  </label>

                  <select
                    value={
                      priority
                    }
                    onChange={(e) =>
                      setPriority(
                        e.target.value
                      )
                    }
                    className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="High">
                      High
                    </option>
                    <option value="Medium">
                      Medium
                    </option>
                    <option value="Low">
                      Low
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <Calendar className="h-4 w-4" />
                    Due Date
                  </label>

                  <input
                    type="date"
                    value={
                      dueDate
                    }
                    onChange={(e) =>
                      setDueDate(
                        e.target.value
                      )
                    }
                    className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-border px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="h-11 rounded-2xl border border-border px-5 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleSave
                }
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {loading
                  ? "Saving..."
                  : "Save Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}