"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowUpDown,
  CheckCircle2,
  Sparkles,
  CalendarDays,
  LayoutGrid,
} from "lucide-react";

import AddTaskButton from "./AddTaskButton";
import DroppableColumn from "./DroppableColumn";
import DraggableTask from "./DraggableTask";
import EditTaskButton from "./EditTaskButton";
import BoardFilter from "./BoardFilter";

export default function BoardDnD({
  board,
}: {
  board: any;
}) {
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const [filter, setFilter] =
    useState("all");
  const [priority, setPriority] =
    useState("all");
  const [search, setSearch] =
    useState("");
  const [sortBy, setSortBy] =
    useState("newest");

  const allTasks = useMemo(
    () =>
      board.columns.flatMap(
        (column: any) =>
          column.tasks || []
      ),
    [board]
  );

  const totalTasks =
    allTasks.length;

  const completedTasks =
    board.columns
      .filter(
        (column: any) =>
          column.title
            .toLowerCase()
            .trim() === "done"
      )
      .flatMap(
        (column: any) =>
          column.tasks || []
      ).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        );

  const visibleColumns =
    board.columns.filter(
      (column: any) =>
        filter === "all" ||
        column.title === filter
    );

  async function handleDragEnd(
    event: DragEndEvent
  ) {
    const { active, over } =
      event;

    if (!over) return;
    if (active.id === over.id)
      return;

    await fetch(
      "/api/tasks/move",
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          taskId: active.id,
          columnId: over.id,
        }),
      }
    );

    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              <Sparkles className="h-3 w-3" />
              Workspace
            </div>

            <h2 className="mt-3 text-2xl font-semibold text-foreground">
              {board.title}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatCard
              icon={
                <LayoutGrid className="h-4 w-4" />
              }
              label="Total"
              value={String(
                totalTasks
              )}
            />

            <StatCard
              icon={
                <CheckCircle2 className="h-4 w-4" />
              }
              label="Done"
              value={String(
                completedTasks
              )}
            />

            <StatCard
              icon={
                <CalendarDays className="h-4 w-4" />
              }
              label="Progress"
              value={`${progress}%`}
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search tasks..."
              className="h-11 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <BoardFilter
              filter={filter}
              setFilter={setFilter}
              priority={priority}
              setPriority={
                setPriority
              }
            />

            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value
                  )
                }
                className="h-11 rounded-2xl border border-border bg-background pl-9 pr-4 text-sm text-foreground"
              >
                <option value="newest">
                  Newest
                </option>
                <option value="priority">
                  Priority
                </option>
                <option value="due">
                  Due Date
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        onDragEnd={
          handleDragEnd
        }
      >
        <div className="relative z-0 grid grid-cols-1 gap-5 items-start md:grid-cols-2 xl:grid-cols-3">
          {visibleColumns.map(
            (column: any) => {
              let tasks = [
                ...(column.tasks ||
                  []),
              ];

              tasks =
                tasks.filter(
                  (task: any) =>
                    task.title
                      ?.toLowerCase()
                      .includes(
                        search.toLowerCase()
                      )
                );

              if (
                priority !==
                "all"
              ) {
                tasks =
                  tasks.filter(
                    (
                      task: any
                    ) =>
                      cleanPriority(
                        task.priority
                      ) ===
                      priority
                  );
              }

              if (
                sortBy === "due"
              ) {
                tasks.sort(
                  (
                    a: any,
                    b: any
                  ) =>
                    (
                      a.due_date ||
                      "9999"
                    ).localeCompare(
                      b.due_date ||
                        "9999"
                    )
                );
              } else if (
                sortBy ===
                "priority"
              ) {
                tasks.sort(
                  (
                    a: any,
                    b: any
                  ) =>
                    rank(
                      cleanPriority(
                        a.priority
                      )
                    ) -
                    rank(
                      cleanPriority(
                        b.priority
                      )
                    )
                );
              } else {
                tasks.sort(
                  (
                    a: any,
                    b: any
                  ) =>
                    new Date(
                      b.created_at
                    ).getTime() -
                    new Date(
                      a.created_at
                    ).getTime()
                );
              }

              return (
                <DroppableColumn
                  key={
                    column.id
                  }
                  id={
                    column.id
                  }
                >
                  <div className="min-h-[420px] rounded-3xl border border-border bg-card p-4 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {
                            column.title
                          }
                        </h3>

                        <p className="text-xs text-muted-foreground">
                          {
                            tasks.length
                          }{" "}
                          tasks
                        </p>
                      </div>

                      <div className="shrink-0">
                        <AddTaskButton
                          columnId={
                            column.id
                          }
                          columnTitle={
                            column.title
                          }
                        />
                      </div>
                    </div>

                    {/* Tasks */}
                    <div className="space-y-3">
                      {tasks.length >
                      0 ? (
                        tasks.map(
                          (
                            task: any
                          ) => (
                            <DraggableTask
                              key={
                                task.id
                              }
                              id={
                                task.id
                              }
                            >
                              <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
                                <EditTaskButton
                                  task={
                                    task
                                  }
                                />
                              </div>
                            </DraggableTask>
                          )
                        )
                      ) : (
                        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                          No tasks
                        </div>
                      )}
                    </div>
                  </div>
                </DroppableColumn>
              );
            }
          )}
        </div>
      </DndContext>
    </div>
  );
}

function cleanPriority(
  value: string
) {
  const v = (
    value || ""
  ).toLowerCase();

  if (v.includes("high"))
    return "High";
  if (v.includes("low"))
    return "Low";

  return "Medium";
}

function rank(value: string) {
  if (value === "High")
    return 1;
  if (value === "Medium")
    return 2;
  return 3;
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background px-4 py-3">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        {icon}

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p className="text-lg font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}