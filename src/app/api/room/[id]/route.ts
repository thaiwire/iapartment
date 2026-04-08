// delete api/room/[id]

import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import z from "zod";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.room.update({
      where: { id : id },
      data: { status: "inactive" },
    });
    return NextResponse.json({ message: "Room deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to delete room" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const room = await prisma.room.update({
      where: { id: id },
      data: { status: "active" },
    });
    return NextResponse.json(room);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to reactivate room" },
      { status: 500 },
    );
  }
}

