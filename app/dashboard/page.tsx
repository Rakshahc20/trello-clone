"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/ui/navbar";
import BoardActions from "@/components/BoardActions";

import {
  Plus,
  LayoutGrid,
  List,
  Search,
  FolderKanban,
  Rocket,
  BarChart3,
  CheckCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

type Board = {
  id: string;
  title: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  const [boards, setBoards] =
    useState<Board[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [creating, setCreating] =
    useState(false);
  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [viewMode, setViewMode] =
    useState<"grid" | "list">(
      "grid"
    );

  async function loadBoards() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "/api/boards"
      );

      const data =
        await res.json();

      setBoards(
        Array.isArray(data)
          ? data
          : []
      );
    } catch {
      setError(
        "Failed to load boards."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoaded)
      loadBoards();
  }, [isLoaded]);

  async function handleCreateBoard() {
    try {
      setCreating(true);
      setError("");

      await fetch(
        "/api/boards",
        {
          method: "POST",
        }
      );

      await loadBoards();
    } catch {
      setError(
        "Unable to create board."
      );
    } finally {
      setCreating(false);
    }
  }

  const filteredBoards =
    useMemo(() => {
      return boards.filter(
        (board) =>
          board.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [boards, search]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        Loading...
      </div>
    );
  }

  const username =
    user?.username ||
    user?.firstName ||
    "User";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.08),transparent_30%)]" />

      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Hero */}
        <section className="mb-8 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                <Sparkles className="h-3.5 w-3.5" />
                Productivity Hub
              </div>

              <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
                Welcome back,{" "}
                {username} 👋
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Manage projects,
                track progress,
                and organize your
                workflow from one
                beautiful dashboard.
              </p>
            </div>

            <button
              onClick={
                handleCreateBoard
              }
              disabled={
                creating
              }
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 text-sm font-medium text-white shadow-lg transition hover:opacity-95 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {creating
                ? "Creating..."
                : "Create Board"}
            </button>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Stats */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Boards"
            value={
              boards.length
            }
            icon={
              <FolderKanban className="h-4 w-4" />
            }
          />

          <StatCard
            title="Projects"
            value={
              boards.length
            }
            icon={
              <Rocket className="h-4 w-4" />
            }
          />

          <StatCard
            title="Activity"
            value={
              boards.length
            }
            icon={
              <BarChart3 className="h-4 w-4" />
            }
          />

          <StatCard
            title="Tasks"
            value="-"
            icon={
              <CheckCheck className="h-4 w-4" />
            }
          />
        </section>

        {/* Toolbar */}
        <section className="mb-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Your Boards
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Free plan:{" "}
                {
                  boards.length
                }
                /1 boards used
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative min-w-[260px]">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  type="text"
                  placeholder="Search boards..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  className="h-11 w-full rounded-2xl border border-slate-800 bg-slate-950 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* View Switch */}
              <div className="flex rounded-2xl border border-slate-800 bg-slate-950 p-1">
                <button
                  onClick={() =>
                    setViewMode(
                      "grid"
                    )
                  }
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                    viewMode ===
                    "grid"
                      ? "bg-blue-500 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>

                <button
                  onClick={() =>
                    setViewMode(
                      "list"
                    )
                  }
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                    viewMode ===
                    "list"
                      ? "bg-blue-500 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        {loading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-slate-400">
            Loading boards...
          </div>
        ) : filteredBoards.length ===
          0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
            <FolderKanban className="mx-auto h-10 w-10 text-slate-600" />

            <h3 className="mt-4 text-lg font-medium">
              No boards found
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Create a board or
              adjust your search.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode ===
              "grid"
                ? "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
                : "space-y-4"
            }
          >
            {filteredBoards.map(
              (board) => (
                <div
                  key={
                    board.id
                  }
                  className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl transition-all hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Link
                      href={`/boards/${board.id}`}
                      className="flex-1"
                    >
                      <div>
                        <div className="mb-3 flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />

                          <span className="rounded-full bg-white/5 px-2 py-1 text-[11px] text-slate-400">
                            Board
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-white">
                          {
                            board.title
                          }
                        </h3>

                        <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                          {board.description ||
                            "A premium workspace for your projects and tasks."}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                          <span>
                            Created{" "}
                            {formatDate(
                              board.created_at
                            )}
                          </span>

                          <span>
                            Updated{" "}
                            {formatDate(
                              board.updated_at
                            )}
                          </span>
                        </div>

                        <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-400">
                          Open Board
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>

                    <BoardActions
                      board={
                        board
                      }
                    />
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <p className="mt-3 text-3xl font-semibold text-white">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-slate-300">
          {icon}
        </div>
      </div>
    </div>
  );
}

function formatDate(
  date?: string
) {
  if (!date) return "-";

  return new Date(
    date
  ).toLocaleDateString();
}