import type { Metadata } from "next";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "FlowBoard",
    template: "%s | FlowBoard",
  },
  description:
    "Modern project management with boards, tasks, and drag-and-drop workflows.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative min-h-screen overflow-x-hidden">
              <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.08),transparent_25%)]" />
              {children}
            </div>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}