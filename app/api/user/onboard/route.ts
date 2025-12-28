import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clerkUserId = searchParams.get("clerkUserId");
  if (!clerkUserId) {
    return NextResponse.json({ error: "Missing clerkUserId" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { clerkUserId } });
  return NextResponse.json({ exists: !!user, user });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { clerkUserId, name, email, introduction, interests } = body;
  if (!clerkUserId || !name || !email || !introduction || !interests) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const user = await prisma.user.create({
    data: {
      clerkUserId,
      name,
      email,
      introduction,
      interests,
    },
  });
  return NextResponse.json({ user });
}
