// GET /api/room/list/[roomTypeid]

import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { z } from "zod";

export async function GET(
  req: Request,
  { params }: { params: { roomTypeid: string } },
) {
  const { roomTypeid } = params;
  
  const rooms = await prisma.room.findMany({
    orderBy: { createdAt: "desc" },
    include: { roomType: true },
    where: {
      status: "active",
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
