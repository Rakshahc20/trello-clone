import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { boardId, title } = await req.json();

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("columns")
    .insert([
      {
        board_id: boardId,
        title,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json(data);
}