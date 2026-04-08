// GET /api/room/list/[roomTypeid]

import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { z } from "zod";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ roomTypeid: string }> },
) {
  const { roomTypeid } = await params;

  console.log("Received roomTypeid:", roomTypeid);

  const rooms = await prisma.room.findMany({
    orderBy: { name: "asc" },
    include: { roomType: true },
    where: {
      // status: "active",
      roomTypeId: roomTypeid,
    },
  });
  return NextResponse.json(rooms);

  try {
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error)?.message || "Failed to fetch rooms" },
      { status: 500 },
    );
  }
}
