// get /api/room-type/{id}
// put /api/room-type/{id}
// delete /api/room-type/{id}

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { z } from "zod";

export async function GET(
  _request: NextRequest,
  context: RouteContext<"/api/room-type/[id]">,
) {
  try {
    const { id } = await context.params;
    const roomType = await prisma.roomType.findUnique({
      where: { id: id },
    });
    if (!roomType) {
      return NextResponse.json(
        { error: "Room type not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(roomType);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch room types" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext<"/api/room-type/[id]">,
) {
  try {
    const formSchema = z.object({
      name: z.string(),
      price: z.number(),
      remark: z.string().optional(),
    });
    const { id } = await context.params;
    const payload = formSchema.parse(await request.json());
    const roomType = await prisma.roomType.update({
      where: { id: id },
      data: payload,
    });
    if (!roomType) {
      return NextResponse.json(
        { error: "Room type not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(roomType);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update room type" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext<"/api/room-type/[id]">,
) {
  try {
    const { id } = await context.params;
    const roomType = await prisma.roomType.update({
      where: { id: id },
      data: { status: "inactive" },
    });
    if (!roomType) {
      return NextResponse.json(
        { error: "Room type not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(roomType);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete room type" },
      { status: 500 },
    );
  }
}
