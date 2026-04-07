// post api/room

import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const schema = z.object({
      roomTypeId: z.string(),
      totalRoom: z.number(),
      towerName: z.string(),
      totalLevel: z.number(),
    });

    let { roomTypeId, totalRoom, towerName, totalLevel } = schema.parse(body);
    totalRoom = Number(totalRoom);
    totalLevel = Number(totalLevel);

    if (totalRoom > 0) {
      const computeTotalRoom = totalRoom * totalLevel;

      for (let i = 1; i <= totalLevel; i++) {
        for (let j = 1; j <= totalRoom; j++) {
          // Generate room number in the format "TowerName-Level-RoomNumber"
          // 1101 = Tower A, Level 1, Room 1
          const roomNo = String(j).padStart(2, "0"); // Pad room number to 2 digits
          const roomName = `${towerName}${i}${roomNo}`;
          await prisma.room.create({
            data: {
              name: roomName,
              roomTypeId: roomTypeId,
              status: "active",
              statusEmpty: "empty",
              towerName: towerName,
              totalLevel: totalLevel,
              totalRoom: computeTotalRoom,
            },
          });
        }
      }
      return NextResponse.json({ message: "Rooms created successfully" });
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error)?.message || "Failed to create room" },
      { status: 500 },
    );
  }
}
