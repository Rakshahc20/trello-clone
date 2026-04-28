 import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import {
  ArrowLeft,
  FolderKanban,
  CheckCircle2,
  Clock3,
  Sparkles,
  PlusCircle,
} from "lucide-react";

import { boardService } from "@/lib/services";
import BoardDnD from "@/components/BoardDnD";
import AddColumnButton from "@/components/AddColumnButton";

export default async function BoardPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } =
    await params;

  const { userId } =
    await auth();

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-slate-300">
        Please sign in to
        continue.
      </div>
    );
  } 

  try {
    const board =
      await boardService.getBoardById(
        id,
        userId
      );

    const totalTasks =
      board.columns?.reduce(
        (
          sum: number,
          column: any
        ) =>
          sum +
          (column.tasks
            ?.length || 0),
        0
      ) || 0;

    const completedColumn =
      board.columns?.find(
        (col: any) =>
          col.title
            .toLowerCase()
            .trim() ===
          "done"
      );

    const completedTasks =
      completedColumn
        ?.tasks?.length || 0;

    const inProgressTasks =
      totalTasks -
      completedTasks;

    const progress =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks /
              totalTasks) *
              100
          );

    return (
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Background Glow */}
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.08),transparent_30%)]" />

        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/75 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/dashboard"
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-slate-700 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 shadow-lg">
                <FolderKanban className="h-5 w-5 text-white" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-500">
                  Project Board
                </p>

                <h1 className="truncate text-lg font-semibold sm:text-xl">
                  {
                    board.title
                  }
                </h1>
              </div>
            </div>

            <AddColumnButton
              boardId={
                board.id
              }
            />
          </div>
        </header>

        {/* Main */}
        <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6">
          {/* Hero */}
          <section className="mb-6 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Premium Workspace
                </div>

                <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
                  {
                    board.title
                  }
                </h2>

                <p className="mt-2 max-w-2xl text-sm text-slate-400">
                  Track progress,
                  manage columns,
                  and organize
                  tasks with a
                  modern kanban
                  workflow.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard
                  title="Tasks"
                  value={
                    totalTasks
                  }
                  icon={
                    <FolderKanban className="h-4 w-4" />
                  }
                />

                <StatCard
                  title="Done"
                  value={
                    completedTasks
                  }
                  icon={
                    <CheckCircle2 className="h-4 w-4" />
                  }
                />

                <StatCard
                  title="Active"
                  value={
                    inProgressTasks
                  }
                  icon={
                    <Clock3 className="h-4 w-4" />
                  }
                />

                <StatCard
                  title="Progress"
                  value={
                    progress
                  }
                  suffix="%"
                  icon={
                    <PlusCircle className="h-4 w-4" />
                  }
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Completion
                </span>

                <span>
                  {
                    completedTasks
                  }
                  /
                  {totalTasks}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          </section>

          {/* Board */}
          <BoardDnD
            board={board}
          />
        </main>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-2xl rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
          <h1 className="text-2xl font-semibold text-red-400">
            Database Error
          </h1>

          <pre className="mt-4 overflow-auto rounded-2xl bg-black/30 p-4 text-sm text-red-200">
            {JSON.stringify(
              error,
              null,
              2
            )}
          </pre>
        </div>
      </div>
    );
  }
}

function StatCard({
  title,
  value,
  icon,
  suffix = "",
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-semibold text-white">
            {value}
            {suffix}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300">
          {icon}
        </div>
      </div>
    </div>
  );
}