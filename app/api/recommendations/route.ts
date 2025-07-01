import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    // Call Python API
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const response = await fetch(`${apiBaseUrl}/by-interest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        interests: user.interests
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const recommendations = await response.json();
    
    // Define the recommendation type
    interface Recommendation {
      Location_Name: string;
      Located_City: string;
      Location_Type: string;
      Rating: number;
      Sentiment: string;
      Sentiment_Score: number;
    }
    
    // Limit the results to 6 and ensure they're sorted by sentiment score
    const limitedRecommendations = recommendations
      .sort((a: Recommendation, b: Recommendation) => b.Sentiment_Score - a.Sentiment_Score)
      .slice(0, 6);
    
    return NextResponse.json(limitedRecommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
