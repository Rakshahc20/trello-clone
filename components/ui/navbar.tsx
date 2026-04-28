"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import {
  LayoutGrid,
  Moon,
  Sun,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { useTheme } from "next-themes";
import {
  useEffect,
  useState,
} from "react";

import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { isSignedIn, user } =
    useUser();

  const pathname =
    usePathname();

  const {
    theme,
    setTheme,
  } = useTheme();

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDashboardPage =
    pathname ===
    "/dashboard";

  const isBoardPage =
    pathname.startsWith(
      "/boards"
    );

  const displayName =
    user?.firstName &&
    user.firstName.trim() !==
      ""
      ? user.firstName
      : user
          ?.emailAddresses?.[0]
          ?.emailAddress ||
        "User";

  if (isBoardPage) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 shadow-lg shadow-blue-500/20">
            <LayoutGrid className="h-5 w-5 text-white" />
          </div>

          <div className="hidden sm:block">
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
              Productivity Suite
            </p>

            <h1 className="text-lg font-semibold text-white transition group-hover:text-blue-400">
              FlowBoard
            </h1>
          </div>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          {mounted && (
            <button
              type="button"
              onClick={() =>
                setTheme(
                  theme ===
                    "dark"
                    ? "light"
                    : "dark"
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {theme ===
              "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Signed In */}
          {isDashboardPage ? (
            <UserButton />
          ) : isSignedIn ? (
            <>
              <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-semibold text-white">
                  {displayName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="max-w-[180px]">
                  <p className="text-xs text-slate-500">
                    Welcome back
                  </p>

                  <p className="truncate text-sm font-medium text-white">
                    {
                      displayName
                    }
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="hidden md:inline-flex h-10 items-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-slate-200 hover:bg-white/10"
              >
                Dashboard
              </Link>

              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="redirect">
                <Button
                  variant="ghost"
                  className="h-10 rounded-2xl border border-white/10 bg-white/5 px-4 text-slate-200 hover:bg-white/10 hover:text-white"
                >
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton mode="redirect">
                <Button className="h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 text-white shadow-lg hover:opacity-95">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}