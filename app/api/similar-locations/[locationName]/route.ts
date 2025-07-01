import { NextRequest, NextResponse } from 'next/server';

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
  { params }: { params: { locationName: string } }
) {
  try {
    // Get the location name from the URL
    const locationName = params.locationName;
    
    if (!locationName) {
      return NextResponse.json(
        { error: 'Location name is required' },
        { status: 400 }
      );
    }

    // Call Python API with timeout
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const encodedLocationName = encodeURIComponent(locationName);
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(`${apiBaseUrl}/similar-locations/${encodedLocationName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal
      });
      
      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error(`API error (${response.status}): ${errorText}`);
        
        return NextResponse.json(
          { error: `API request failed with status ${response.status}` },
          { status: response.status }
        );
      }

      const similarLocations = await response.json();
      
      // Validate response format
      if (!Array.isArray(similarLocations)) {
        console.error('Invalid API response format:', similarLocations);
        return NextResponse.json(
          { error: 'Invalid response format from API' },
          { status: 500 }
        );
      }
      
      // Ensure data is sorted by similarity (highest first)
      const sortedLocations = [...similarLocations].sort(
        (a: SimilarLocation, b: SimilarLocation) => b.similarity - a.similarity
      );
      
      return NextResponse.json(sortedLocations);
    } catch (error) {
      clearTimeout(timeout);
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('API request timed out');
        return NextResponse.json(
          { error: 'API request timed out. Please try again.' },
          { status: 504 }
        );
      }
      
      throw error; // Let the outer catch handle other errors
    }
  } catch (error) {
    console.error('Error fetching similar locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch similar locations. Please try again later.' },
      { status: 500 }
    );
  }
}
