import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

interface UserProfile {
  comments: string;
  user_locale: string;
  user_contrib: number;
  top_k: number;
}

interface PredictedInterest {
  location_type: string;
  confidence: number;
}

interface PredictionResponse {
  top_interests: PredictedInterest[];
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔍 [API Route] User ID:', userId);

    // Get user data from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('👤 [API Route] User data:', {
      name: user.name,
      email: user.email,
      introduction: user.introduction,
      interests: user.interests
    });

    // Initialize with user's existing interests
    let allLocationTypes = [...(user.interests || [])];
    let predictedInterests: PredictedInterest[] = [];

    // Prepare user profile for prediction
    const userProfile: UserProfile = {
      comments: user.introduction || '',
      user_locale: '', // Can be enhanced with user's location if available
      user_contrib: 0, // Can be enhanced with user's contribution count
      top_k: 5
    };

    console.log('📝 [API Route] User profile for prediction:', userProfile);
    console.log('🔍 [API Route] User interests from database:', user.interests);

    // Call FastAPI prediction endpoint
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    
    console.log('🚀 [API Route] Calling FastAPI endpoint:', `${apiBaseUrl}/predict-user-interests`);
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(`${apiBaseUrl}/predict-user-interests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userProfile),
        signal: controller.signal
      });
      
      clearTimeout(timeout);

      console.log('📡 [API Route] FastAPI response status:', response.status);

      if (response.ok) {
        const predictionData: PredictionResponse = await response.json();
        
        console.log('🎯 [API Route] Raw prediction data from FastAPI:', predictionData);
        
        // Validate response format
        if (predictionData.top_interests && Array.isArray(predictionData.top_interests)) {
          console.log('✅ [API Route] Validated predicted interests:', predictionData.top_interests);

          // Extract location types from predictions
          // FastAPI returns: [['location_type', confidence], ['location_type', confidence], ...]
          const predictedLocationTypes = predictionData.top_interests
            .filter((interest: any) => Array.isArray(interest) && interest.length >= 2)
            .map((interest: any) => interest[0]); // Get the location_type (first element)

          console.log('📍 [API Route] AI predicted location types:', predictedLocationTypes);

          // Combine user interests with AI predictions (avoid duplicates)
          const newTypes = predictedLocationTypes.filter(type => !allLocationTypes.includes(type));
          allLocationTypes = [...allLocationTypes, ...newTypes];

          // Transform predicted interests to match expected format
          predictedInterests = predictionData.top_interests
            .filter((interest: any) => Array.isArray(interest) && interest.length >= 2)
            .map((interest: any) => ({
              location_type: interest[0],
              confidence: interest[1]
            }));

          console.log('🎉 [API Route] Combined location types:', allLocationTypes);
        }
      } else {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.warn(`⚠️ [API Route] FastAPI error (${response.status}): ${errorText}`);
      }
    } catch (error) {
      clearTimeout(timeout);
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('⏰ [API Route] Prediction API request timed out');
        return NextResponse.json(
          { error: 'Prediction API request timed out. Please try again.' },
          { status: 504 }
        );
      }
      
      console.warn('⚠️ [API Route] Failed to get AI predictions, using only user interests:', error);
    }

    // If no interests at all, return error
    if (allLocationTypes.length === 0) {
      return NextResponse.json(
        { error: 'No interests found. Please set your interests first.' },
        { status: 400 }
      );
    }

    console.log('🔍 [API Route] Final location types to search for:', allLocationTypes);

    // Get locations from database based on combined interests
    const recommendedLocations = await prisma.location.findMany({
      where: {
        type: {
          in: allLocationTypes
        }
        // Removed overallRating filter to show all matching locations
      },
      orderBy: [
        { overallRating: 'desc' },  // Rated locations first
        { name: 'asc' }             // Then alphabetically
      ],
      take: 8, // Increased to accommodate more interests
      include: {
        _count: {
          select: {
            feedbacks: true
          }
        }
      }
    });

    console.log('🗺️ [API Route] Found locations in database:', recommendedLocations.length);
    console.log('📍 [API Route] Location details:', recommendedLocations.map(loc => ({
      name: loc.name,
      type: loc.type,
      rating: loc.overallRating,
      reviewCount: loc._count?.feedbacks || 0
    })));

    // Transform to match the expected format
    const formattedRecommendations = recommendedLocations.map(location => ({
      Location_Name: location.name,
      Located_City: location.locatedCity,
      Location_Type: location.type,
      Rating: location.overallRating,
      Sentiment: 'Positive', // Default sentiment
      Sentiment_Score: location.overallRating / 5, // Normalize to 0-1 range
      reviewCount: location._count?.feedbacks || 0,
      imageUrl: location.unsplashImage || '' // Add image URL
    }));

    console.log('🎉 [API Route] Final response:', {
      recommendationsCount: formattedRecommendations.length,
      predictedInterestsCount: predictedInterests.length
    });

    return NextResponse.json({
      recommendations: formattedRecommendations,
      predictedInterests: predictedInterests
    });
  } catch (error) {
    console.error('❌ [API Route] Error predicting user interests:', error);
    return NextResponse.json(
      { error: 'Failed to predict user interests. Please try again later.' },
      { status: 500 }
    );
  }
} 