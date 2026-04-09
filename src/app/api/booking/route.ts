// Post api/booking/route.ts

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/libs/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const schema = z.object({
      customerName: z.string(),
      customerPhone: z.string(),
      customerAddress: z.string(),
      cardId: z.string(),
      gender: z.string(),
      roomId: z.string(),
      remark: z.string().optional(),
      deposit: z.number(),
      stayAt: z.string().transform((str) => new Date(str)),
      stayTo: z
        .string()
        .nullable()
        .optional()
        .transform((str) => (str ? new Date(str) : null)),
    });

    const {
      customerName,
      customerPhone,
      customerAddress,
      cardId,
      gender,
      roomId,
      remark,
      deposit,
      stayAt,
      stayTo,
    } = schema.parse(body);

    const booking = await prisma.booking.create({
      data: {
        customerName: customerName,
        customerPhone: customerPhone,
        customerAddrsss: customerAddress,
        cardId: cardId,
        gender: gender,
        roomId: roomId,
        remark: remark,
        deposit: deposit,
        stayAt: stayAt,
        stayto: stayTo,
        status: "active",
      },
    });
    // Update the room status to "no"
    await prisma.room.update({
      where: { id: roomId },
      data: { statusEmpty: "no" },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error)?.message || "Failed to create booking" },
      { status: 500 },
    );
  }
}
