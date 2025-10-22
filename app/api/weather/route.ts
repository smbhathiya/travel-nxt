import { NextRequest, NextResponse } from 'next/server';
import { getWeatherForLocations } from '@/lib/weather/weatherService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');

    if (!city) {
      return NextResponse.json(
        { error: 'City parameter is required' },
        { status: 400 }
      );
    }

    const weatherData = await getWeatherForLocations([{ Location_Name: city, Located_City: city }]);
    
    if (weatherData && weatherData.length > 0) {
      return NextResponse.json(weatherData[0]);
    } else {
      return NextResponse.json(
        { error: 'Weather data not found for this city' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

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
