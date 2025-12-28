import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the recommendation type
interface Recommendation {
  Location_Name: string;
  Located_City: string;
  Location_Type: string;
  Rating: number;
  Sentiment: string;
  Sentiment_Score: number;
}

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔍 [Recommendations API] Getting user interests...');

    // Get user interests from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || !user.interests.length) {
      return NextResponse.json(
        { error: 'No interests found. Please set your interests first.' },
        { status: 400 }
      );
    }

    console.log('✅ [Recommendations API] User interests:', user.interests);

    // Get locations from database based on user interests
    const recommendedLocations = await prisma.location.findMany({
      where: {
        type: {
          in: user.interests
        },
        overallRating: {
          gt: 0
        }
      },
      orderBy: {
        overallRating: 'desc'
      },
      take: 6,
      include: {
        feedbacks: {
          select: { sentiment: true }
        },
        _count: {
          select: { feedbacks: true }
        }
      }
    });

    console.log('🗺️ [Recommendations API] Found locations:', recommendedLocations.length);

    // Transform to match the expected format
    const formattedRecommendations: Recommendation[] = recommendedLocations.map(location => {
      const total = location.feedbacks?.length || 0;
      const positiveCount = location.feedbacks?.filter(f => f.sentiment === 'Positive').length || 0;
      const sentimentScore = total ? (positiveCount / total) : (location.overallRating / 5);

      return {
        Location_Name: location.name,
        Located_City: location.locatedCity,
        Location_Type: location.type,
        Rating: location.overallRating,
        Sentiment: 'Positive',
        Sentiment_Score: sentimentScore,
      };
    });

    console.log('🎉 [Recommendations API] Returning recommendations:', formattedRecommendations.length);
    
    return NextResponse.json(formattedRecommendations);
  } catch (error) {
    console.error('❌ [Recommendations API] Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations. Please try again later.' },
      { status: 500 }
    );
  }
}
