import Navbar from "@/components/ui/navbar";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  LayoutGrid,
  ShieldCheck,
  Zap,
  KanbanSquare,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      title: "Visual Boards",
      desc: "Organize work with beautiful drag-and-drop kanban boards.",
      icon: <KanbanSquare className="h-5 w-5" />,
    },
    {
      title: "Fast Workflow",
      desc: "Create tasks, move priorities, and track progress instantly.",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      title: "Secure Access",
      desc: "Authentication powered with modern user management.",
      icon: <ShieldCheck className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-violet-500/10" />

          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm shadow-sm">
                <LayoutGrid className="h-4 w-4 text-blue-500" />
                Modern Project Management
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Manage Projects
                <span className="block bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                  Faster Than Ever
                </span>
              </h1>

              <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                Plan tasks, organize boards, collaborate visually, and stay on top
                of every deadline with a premium kanban experience.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-6 text-primary-foreground shadow-lg transition hover:opacity-90"
                >
                  Open Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-border bg-card px-6 transition hover:bg-muted"
                >
                  Try Demo
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Drag & Drop Tasks
                </span>

                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Dark Mode
                </span>

                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Secure Sign In
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-sm font-medium text-blue-500">FEATURES</p>

            <h2 className="mt-2 text-3xl font-bold">
              Everything you need to stay productive
            </h2>

            <p className="mt-3 text-muted-foreground">
              Built for creators, teams, students, and growing businesses.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {features.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white">
                  {item.icon}
                </div>

                <h3 className="text-lg font-semibold">{item.title}</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to organize your workflow?
            </h2>

            <p className="mt-4 text-muted-foreground">
              Create your first board and start managing tasks in minutes.
            </p>

            <Link
              href="/dashboard"
              className="mt-8 inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-6 text-white shadow-lg transition hover:opacity-95"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}