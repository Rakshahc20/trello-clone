import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { boardService } from "@/lib/services";

export async function GET() {
  const { userId } = await auth();

  if (!userId) return NextResponse.json([]);

  const boards = await boardService.getBoards(userId);
  return NextResponse.json(boards);
}

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const board = await boardService.createBoard(userId);
  return NextResponse.json(board);
}