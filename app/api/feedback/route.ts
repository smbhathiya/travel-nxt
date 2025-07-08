import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { locationId, comment, sentiment, confidence, rating } =
      await req.json();
    const session = await auth();
    const clerkUserId = session?.userId;
    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    const user = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }
    // Use user.id for feedback
    const feedback = await prisma.feedback.create({
      data: {
        locationId,
        comment,
        sentiment,
        confidence,
        rating: rating ?? null,
        userId: user.id,
      },
    });
    // Update overall rating if rating is provided
    if (rating) {
      const feedbacks = await prisma.feedback.findMany({
        where: { locationId, rating: { not: null } },
      });
      const avg =
        feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) /
        feedbacks.length;
      await prisma.location.update({
        where: { id: locationId },
        data: { overallRating: avg },
      });
    }
    return NextResponse.json(feedback);
  } catch (err) {
    console.error("Feedback API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
