// GET /api/room-type/
// POST /api/room-type/

import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { z } from "zod";

const RoomTypeSchema = z.object({
  name: z.string(),
  price: z.number(),
  remark: z.string().optional(),
});

export async function GET() {
  try {
    return NextResponse.json(
      await prisma.roomType.findMany({
        orderBy: { createdAt: "desc" },
        where: { status: "active" },
      }),
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch room types" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await prisma.roomType.create({
      data: RoomTypeSchema.parse(body),
    });
    return NextResponse.json({ message: "Room type created successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create room type" },
      { status: 500 },
    );
  }
}
