// get
// post
// put
// delete

import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const apartmentSchema = z.object({
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string().optional(),
  lineId: z.string().optional(),
  taxCode: z.string().optional(),
});

export async function GET() {
  try {
    const apartments = await prisma.apartment.findFirst();
    return NextResponse.json(apartments);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch apartments" },
      { status: 500 },
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
    return NextResponse.json({ message: "Apartment data saved successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create apartment" },
      { status: 500 },
    );
  }
}
