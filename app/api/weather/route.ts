import { NextRequest, NextResponse } from 'next/server';
import { getWeatherForLocations } from '@/lib/weather/weatherService';

export async function POST(request: NextRequest) {
  try {
    const { locations } = await request.json();

    if (!locations || !Array.isArray(locations)) {
      return NextResponse.json(
        { error: 'Invalid locations data' },
        { status: 400 }
      );
    }

    const weatherData = await getWeatherForLocations(locations);
    
    return NextResponse.json({ weatherData });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
