import { NextRequest, NextResponse } from 'next/server';

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

    // Call Python API with timeout
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const encodedLocationName = encodeURIComponent(locationName);
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(`${apiBaseUrl}/location-details/${encodedLocationName}`, {
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

      const locationDetails = await response.json();
      
      // Validate response format
      if (!Array.isArray(locationDetails)) {
        console.error('Invalid API response format:', locationDetails);
        return NextResponse.json(
          { error: 'Invalid response format from API' },
          { status: 500 }
        );
      }
      
      // Check if we have any results
      if (locationDetails.length === 0) {
        return NextResponse.json(
          { error: 'No details found for this location' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(locationDetails);
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
    console.error('Error fetching location details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch location details. Please try again later.' },
      { status: 500 }
    );
  }
}
