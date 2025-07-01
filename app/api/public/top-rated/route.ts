import { NextResponse } from 'next/server';

export async function GET() {
  // Call Python API to get top rated locations
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  
  // Add timeout to the fetch request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
  
  try {
    const response = await fetch(`${apiBaseUrl}/top-rated`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      // Ensure we get fresh data
      cache: 'no-store',
    });

    // Clear the timeout since we got a response
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const topRatedLocations = await response.json();
    
    // Limit to top 6
    const limitedLocations = topRatedLocations.slice(0, 6);
    
    return NextResponse.json(limitedLocations);
  } catch (error) {
    // Clear timeout if there was an error
    clearTimeout(timeoutId);
    
    console.error('Error fetching top rated locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top rated locations' },
      { status: 500 }
    );
  }
}
