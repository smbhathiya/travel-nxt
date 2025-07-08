import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  if (!category) {
    return NextResponse.json({ error: "Category is required" }, { status: 400 });
  }
  const locations = await prisma.location.findMany({
    where: {
      type: {
        equals: category,
        mode: "insensitive",
      },
    },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(locations);
}
