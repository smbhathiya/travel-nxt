import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Call Python API to get top rated locations
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const response = await fetch(`${apiBaseUrl}/top-rated`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const topRatedLocations = await response.json();
    
    // Limit to top 6
    const limitedLocations = topRatedLocations.slice(0, 6);
    
    return NextResponse.json(limitedLocations);
  } catch (error) {
    console.error('Error fetching top rated locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top rated locations' },
      { status: 500 }
    );
  }
}
