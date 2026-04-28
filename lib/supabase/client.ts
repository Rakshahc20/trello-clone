import { createBrowserClient } from "@supabase/ssr";
import { useAuth } from "@clerk/nextjs";

export function createClient(token?: string) {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      },
    }
  );
}