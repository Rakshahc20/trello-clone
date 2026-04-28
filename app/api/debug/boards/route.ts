import { createServerSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const supabase = await createServerSupabaseClient();

  // Get all boards for this user
  const { data: boards, error } = await supabase
    .from("boards")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    userId,
    boardCount: boards?.length || 0,
    boards: boards || [],
  });
}
