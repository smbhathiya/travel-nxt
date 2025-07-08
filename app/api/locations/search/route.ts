import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  // Search locations by name (case-insensitive, partial match)
  const locations = await prisma.location.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: 20,
    orderBy: { name: "asc" },
  });

  return NextResponse.json(locations);
}
