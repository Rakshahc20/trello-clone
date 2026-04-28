import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { columnId, title, description } = await req.json();

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          column_id: columnId,
          tittle: title, // use DB column name
          description: description,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}