// GET /api/room/list/[roomTypeid]

import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ roomTypeid: string }> },
) {
  try {
    const { roomTypeid } = await params;

    const rooms = await prisma.room.findMany({
      orderBy: { name: "asc" },
      include: { roomType: true, bookings: true },
      where: {
        roomTypeId: roomTypeid,
      },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error)?.message || "Failed to fetch rooms" },
      { status: 500 },
    );
  }
}
