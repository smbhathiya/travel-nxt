import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(
      "🗺️ [Top Rated API] Fetching top rated locations from database..."
    );

    // Get top rated locations from database
    const topRatedLocations = await prisma.location.findMany({
      where: {
        overallRating: {
          gt: 0, // Only get locations with ratings
        },
      },
      orderBy: {
        overallRating: "desc",
      },
      take: 6,
      include: {
        feedbacks: {
          select: {
            sentiment: true,
          },
        },
        _count: {
          select: {
            feedbacks: true,
          },
        },
      },
    });

    console.log(
      "✅ [Top Rated API] Found locations:",
      topRatedLocations.length
    );

    // Transform to match the expected format
    const formattedLocations = topRatedLocations.map((location) => {
      const total = location.feedbacks?.length || 0;
      const positiveCount =
        location.feedbacks?.filter((f) => f.sentiment === "Positive").length ||
        0;
      const sentimentScore = total
        ? positiveCount / total
        : location.overallRating / 5;

      return {
        Location_Name: location.name,
        Located_City: location.locatedCity,
        Location_Type: location.type,
        Rating: location.overallRating,
        Sentiment: "Positive",
        Sentiment_Score: sentimentScore,
        reviewCount: total || location._count?.feedbacks || 0,
      };
    });

    console.log(
      "🎉 [Top Rated API] Returning formatted locations:",
      formattedLocations.length
    );

    return NextResponse.json(formattedLocations);
  } catch (error) {
    console.error(
      "❌ [Top Rated API] Error fetching top rated locations:",
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch top rated locations" },
      { status: 500 }
    );
  }
}
