'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export interface PersonalizedRecommendation {
  Location_Name: string;
  Located_City: string;
  Location_Type: string;
  Rating: number;
  Sentiment: string;
  Sentiment_Score: number;
  reviewCount: number;
}

export interface PredictedInterest {
  location_type: string;
  confidence: number;
}

export interface PersonalizedRecommendationsResponse {
  recommendations: PersonalizedRecommendation[];
  predictedInterests: PredictedInterest[];
}

export async function getPersonalizedRecommendations(): Promise<PersonalizedRecommendationsResponse> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Get user data from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    console.log('🔍 [AI Prediction] User interests from database:', user.interests);

    // Prepare user profile for prediction
    const userProfile = {
      comments: user.introduction || '',
      user_locale: '', // Can be enhanced with user's location if available
      user_contrib: 0, // Can be enhanced with user's contribution count
      top_k: 5
    };

    console.log('🔍 [AI Prediction] User profile for prediction:', {
      userId,
      introduction: userProfile.comments,
      user_locale: userProfile.user_locale,
      user_contrib: userProfile.user_contrib,
      top_k: userProfile.top_k
    });

    // Initialize with user's existing interests
    let allLocationTypes = [...(user.interests || [])];
    let predictedInterests: PredictedInterest[] = [];
    let usingPredictedInterests = false;

    // Try to get AI predictions
    try {
      // Call FastAPI prediction endpoint
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      
      console.log('🚀 [AI Prediction] Calling FastAPI endpoint:', `${apiBaseUrl}/predict-user-interests`);
      
      const response = await fetch(`${apiBaseUrl}/predict-user-interests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userProfile),
      });

      console.log('📡 [AI Prediction] FastAPI response status:', response.status);

      if (response.ok) {
        const predictionData = await response.json();
        
        console.log('🎯 [AI Prediction] Raw prediction data:', predictionData);
        
        // Validate response format
        if (predictionData.top_interests && Array.isArray(predictionData.top_interests)) {
          console.log('✅ [AI Prediction] Predicted interests:', predictionData.top_interests);

          // Extract location types from predictions
          // FastAPI returns: [['location_type', confidence], ['location_type', confidence], ...]
          const predictedLocationTypes = predictionData.top_interests
            .filter((interest: any) => Array.isArray(interest) && interest.length >= 2)
            .map((interest: any) => interest[0]); // Get the location_type (first element)

          console.log('📍 [AI Prediction] AI predicted location types:', predictedLocationTypes);

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

          usingPredictedInterests = true;
          console.log('🎉 [AI Prediction] Combined location types:', allLocationTypes);
        }
      } else {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.warn(`⚠️ [AI Prediction] FastAPI error (${response.status}): ${errorText}`);
      }
    } catch (error) {
      console.warn('⚠️ [AI Prediction] Failed to get AI predictions, using only user interests:', error);
    }

    // If no interests at all, throw error
    if (allLocationTypes.length === 0) {
      throw new Error('No interests found. Please set your interests first.');
    }

    console.log('🔍 [AI Prediction] Final location types to search for:', allLocationTypes);

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

    console.log('🗺️ [AI Prediction] Found locations in database:', recommendedLocations.length);
    console.log('📍 [AI Prediction] Location details:', recommendedLocations.map(loc => ({
      name: loc.name,
      type: loc.type,
      rating: loc.overallRating,
      reviewCount: loc._count?.feedbacks || 0
    })));

    // Transform to match the expected format
    const formattedRecommendations: PersonalizedRecommendation[] = recommendedLocations.map(location => ({
      Location_Name: location.name,
      Located_City: location.locatedCity,
      Location_Type: location.type,
      Rating: location.overallRating,
      Sentiment: 'Positive', // Default sentiment
      Sentiment_Score: location.overallRating / 5, // Normalize to 0-1 range
      reviewCount: location._count?.feedbacks || 0
    }));

    console.log('🎉 [AI Prediction] Final formatted recommendations:', formattedRecommendations);

    return {
      recommendations: formattedRecommendations,
      predictedInterests: predictedInterests
    };

  } catch (error) {
    console.error('❌ [AI Prediction] Error getting personalized recommendations:', error);
    throw new Error('Failed to get personalized recommendations');
  }
} 