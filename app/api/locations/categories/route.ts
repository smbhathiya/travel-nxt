import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Get all unique types and their counts from the Location table
  const categories = await prisma.location.groupBy({
    by: ['type'],
    _count: { id: true },
    orderBy: { type: 'asc' },
  });
  return NextResponse.json(categories);
}
