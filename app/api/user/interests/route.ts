import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { interests } = await request.json();

    if (!interests || !Array.isArray(interests)) {
      return NextResponse.json(
        { error: "Invalid interests data" },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { clerkUserId: userId } });

    if (!user) {
      // Create new user if doesn't exist
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          name: "",
          email: "",
          introduction: "",
          interests: interests,
        },
      });
    } else {
      // Update existing user's interests
      user = await prisma.user.update({
        where: { clerkUserId: userId },
        data: { interests },
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error saving user interests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    return NextResponse.json({ interests: user?.interests || [] });
  } catch (error) {
    console.error("Error fetching user interests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
