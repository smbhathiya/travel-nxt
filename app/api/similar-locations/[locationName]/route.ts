import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the SimilarLocation type
interface SimilarLocation {
  Location_Name: string;
  Located_City: string;
  Location_Type: string;
  Rating: number;
  similarity: number;
  Sentiment: string;
  Sentiment_Score: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locationName: string }> }
) {
  try {
    // Await params before accessing properties (Next.js 15 requirement)
    const { locationName } = await params;
    
    if (!locationName) {
      return NextResponse.json(
        { error: 'Location name is required' },
        { status: 400 }
      );
    }

    console.log('🔍 [Similar Locations API] Looking for similar locations to:', locationName);

    // First, find the target location to get its type
    const targetLocation = await prisma.location.findFirst({
      where: {
        name: {
          contains: locationName,
          mode: 'insensitive'
        }
      }
    });

    if (!targetLocation) {
      console.log('❌ [Similar Locations API] Target location not found:', locationName);
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    console.log('✅ [Similar Locations API] Found target location:', targetLocation.name, 'Type:', targetLocation.type);

    // Find similar locations based on the same type
    const similarLocations = await prisma.location.findMany({
      where: {
        type: targetLocation.type,
        name: {
          not: targetLocation.name // Exclude the target location
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
        feedbacks: { select: { sentiment: true } },
        _count: { select: { feedbacks: true } }
      }
    });

    console.log('🗺️ [Similar Locations API] Found similar locations:', similarLocations.length);

    // Transform to match the expected format
    const formattedSimilarLocations: SimilarLocation[] = similarLocations.map(location => {
      const total = location.feedbacks?.length || 0;
      const positiveCount = location.feedbacks?.filter(f => f.sentiment === 'Positive').length || 0;
      const sentimentScore = total ? (positiveCount / total) : (location.overallRating / 5);

      return {
        Location_Name: location.name,
        Located_City: location.locatedCity,
        Location_Type: location.type,
        Rating: location.overallRating,
        similarity: 0.8,
        Sentiment: 'Positive',
        Sentiment_Score: sentimentScore
      };
    });

    console.log('🎉 [Similar Locations API] Returning similar locations:', formattedSimilarLocations.length);
    
    return NextResponse.json(formattedSimilarLocations);
  } catch (error) {
    console.error('❌ [Similar Locations API] Error fetching similar locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch similar locations. Please try again later.' },
      { status: 500 }
    );
  }
}
