"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Flag,
  Loader2,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

type Task = {
  id: string;
  title: string;
  description?: string;
  priority?: string;
  due_date?: string | null;
};

export default function EditTaskButton({
  task,
}: {
  task: Task;
}) {
  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [title, setTitle] =
    useState(task.title);

  const [
    description,
    setDescription,
  ] = useState(
    task.description || ""
  );

  const [priority, setPriority] =
    useState(
      task.priority || "Medium"
    );

  const [dueDate, setDueDate] =
    useState(
      task.due_date
        ? task.due_date.split("T")[0]
        : ""
    );

  const [loading, setLoading] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  async function handleSave() {
    if (!title.trim()) {
      alert("Task title is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `/api/tasks/${task.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            priority,
            due_date:
              dueDate || null,
          }),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      setOpen(false);
      router.refresh();
    } catch {
      alert("Failed to update task");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        "Delete this task?"
      )
    )
      return;

    try {
      setDeleting(true);

      const res = await fetch(
        `/api/tasks/${task.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      setOpen(false);
      router.refresh();
    } catch {
      alert("Failed to delete task");
    } finally {
      setDeleting(false);
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
        className="group flex w-full items-start gap-2 text-left"
      >
        <span className="line-clamp-2 flex-1 break-words text-foreground transition group-hover:text-primary">
          {task.title}
        </span>

        <Pencil className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[99999] isolate flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative z-[100000] w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Edit Task
                </p>

                <h2 className="text-xl font-semibold text-foreground">
                  Update task details
                </h2>
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
                <label className="mb-2 block text-sm font-medium">
                  Title
                </label>

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                  className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
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
                  className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium">
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
                    className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm"
                  >
                    <option>
                      High
                    </option>
                    <option>
                      Medium
                    </option>
                    <option>
                      Low
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium">
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
                    className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-3 border-t border-border px-6 py-4 sm:flex-row sm:justify-between">
              <button
                onClick={
                  handleDelete
                }
                disabled={
                  deleting
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-500/30 px-5 text-sm text-red-500 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </button>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() =>
                    setOpen(
                      false
                    )
                  }
                  className="h-11 rounded-2xl border border-border px-5 text-sm"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    handleSave
                  }
                  disabled={
                    loading
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm text-primary-foreground disabled:opacity-50"
                >
                  {loading && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {loading
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}