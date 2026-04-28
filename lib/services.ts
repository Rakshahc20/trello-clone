export const boardService = {
  async getBoards(userId: string, token?: string) {
    const supabase = token
      ? (await import("@/lib/supabase/client")).createClient(token)
      : await (await import("@/lib/supabase/server")).createServerSupabaseClient();

    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createBoard(userId: string, token?: string) {
    const supabase = token
      ? (await import("@/lib/supabase/client")).createClient(token)
      : await (await import("@/lib/supabase/server")).createServerSupabaseClient();

    const { data: board, error } = await supabase
      .from("boards")
      .insert({
        title: "New Board",
        description: "My board",
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;

    const { error: columnError } = await supabase.from("columns").insert([
      {
        board_id: board.id,
        title: "To Do",
        sort_order: 0,
        user_id: userId,
      },
      {
        board_id: board.id,
        title: "Doing",
        sort_order: 1,
        user_id: userId,
      },
      {
        board_id: board.id,
        title: "Done",
        sort_order: 2,
        user_id: userId,
      },
    ]);

    if (columnError) throw columnError;

    return board;
  },

  async getBoardById(id: string, userId: string) {
    const { createServerSupabaseClient } = await import(
      "@/lib/supabase/server"
    );

    const supabase = await createServerSupabaseClient();

    const { data: board, error: boardError } = await supabase
      .from("boards")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (boardError) throw boardError;
    if (!board) throw new Error("Board not found");

    const { data: columns, error: columnsError } = await supabase
      .from("columns")
      .select(`
        *,
        tasks (*)
      `)
      .eq("board_id", id)
      .order("sort_order", { ascending: true });

    if (columnsError) throw columnsError;

    return {
      ...board,
      columns: columns || [],
    };
  },

  async updateBoard(
    id: string,
    updates: { title?: string; description?: string },
    token?: string
  ) {
    const supabase = token
      ? (await import("@/lib/supabase/client")).createClient(token)
      : await (await import("@/lib/supabase/server")).createServerSupabaseClient();

    const { data, error } = await supabase
      .from("boards")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteBoard(id: string, token?: string) {
    const supabase = token
      ? (await import("@/lib/supabase/client")).createClient(token)
      : await (await import("@/lib/supabase/server")).createServerSupabaseClient();

    const { error } = await supabase
      .from("boards")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },
};