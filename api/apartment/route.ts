// GET /api/apartment

import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const apartmentSchema = z.object({
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.email().optional(),
  lineId: z.string().optional(),
  taxCode: z.string(),
});

export async function GET() {
  try {
    return NextResponse.json(await prisma.apartment.findMany()) ?? {};
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const oldApartment = await prisma.apartment.findFirst();

    if (oldApartment) {
      await prisma.apartment.update({
        where: { id: oldApartment.id },
        data: apartmentSchema.parse(body),
      });
    } else {
      await prisma.apartment.create({
        data: apartmentSchema.parse(body),
      });
    }

    return Response.json({ message: "Success" });
    
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
