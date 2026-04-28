import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PATCH(req: Request) {
  try {
    const { taskId, columnId } = await req.json();

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("tasks")
      .update({
        column_id: columnId,
      })
      .eq("id", taskId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}