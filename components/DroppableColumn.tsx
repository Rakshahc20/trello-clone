"use client";

import { useDroppable } from "@dnd-kit/core";

export default function DroppableColumn({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } =
    useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="relative"
    >
      {children}
    </div>
  );
}