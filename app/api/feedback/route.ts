import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { locationId, comment, sentiment, confidence, rating, userId } = await req.json();
  if (!locationId || !comment || !sentiment) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  // Save feedback with sentiment and optional rating
  const feedback = await prisma.feedback.create({
    data: {
      locationId,
      comment,
      sentiment,
      confidence,
      rating: rating ?? null,
      userId: userId ?? null,
    },
  });
  // Update overall rating if rating is provided
  if (rating) {
    const feedbacks = await prisma.feedback.findMany({ where: { locationId, rating: { not: null } } });
    const avg = feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length;
    await prisma.location.update({ where: { id: locationId }, data: { overallRating: avg } });
  }
  return NextResponse.json(feedback);
}
