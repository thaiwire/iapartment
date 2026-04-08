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
      remark: z.string(),
      deposit: z.number(),
      stayAt: z.string(),
      stayTo: z.string(),
      status: z.string(),
    });
    


  } catch (error) {
    return NextResponse.json(
      { error: (error as Error)?.message || "Failed to create booking" },
      { status: 500 },
    );
  }
}
