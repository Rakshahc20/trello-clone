import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase =
      await createServerSupabaseClient();

    const {
      columnId,
      title,
      description,
      priority,
      due_date,
    } = await req.json();

    const { data: lastTask } =
      await supabase
        .from("tasks")
        .select("sort_order")
        .eq("column_id", columnId)
        .order("sort_order", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

    const nextSort =
      (lastTask?.sort_order || 0) + 1;

    const { data, error } =
      await supabase
        .from("tasks")
        .insert([
          {
            column_id: columnId,
            title,
            description,
            priority,
            due_date,
            user_id: userId,
            sort_order: nextSort,
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
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "Something went wrong",
      },
      { status: 500 }
    );
  }
}