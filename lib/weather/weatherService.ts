// Weather service using OpenWeather API and Gemini API
// Free tier provides 5-day forecast with 3-hour intervals

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface WeatherForecast {
  date: string;
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface LocationWeather {
  location: string;
  city: string;
  forecast: WeatherForecast[];
  description: string;
}

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Initialize Gemini AI
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export async function get5DayForecast(city: string): Promise<WeatherForecast[]> {
  if (!OPENWEATHER_API_KEY) {
    console.warn('OpenWeather API key not found');
    return [];
  }

  try {
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/forecast?q=${city},LK&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Process the forecast data - OpenWeather returns 40 entries (5 days * 8 entries per day)
    // We'll take one entry per day (around noon time)
    const dailyForecasts: WeatherForecast[] = [];
    const processedDates = new Set();

    for (const item of data.list) {
      const date = new Date(item.dt * 1000);
      const dateString = date.toDateString();
      
      // Skip if we already have this date, and prefer entries around noon (12:00)
      if (processedDates.has(dateString)) continue;
      
      const hour = date.getHours();
      if (hour < 9 || hour > 15) continue; // Only take entries between 9 AM and 3 PM
      
      processedDates.add(dateString);
      
      dailyForecasts.push({
        date: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        temp: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 3.6) // Convert m/s to km/h
      });

      if (dailyForecasts.length >= 5) break;
    }

    return dailyForecasts;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return [];
  }
}

export async function getWeatherForLocations(locations: Array<{Location_Name: string, Located_City: string}>): Promise<LocationWeather[]> {
  const weatherPromises = locations.map(async (location) => {
    try {
      // Fetch weather and description in parallel
      const [forecast, description] = await Promise.all([
        get5DayForecast(location.Located_City),
        getLocationDescription(location.Location_Name, location.Located_City)
      ]);
      
      return {
        location: location.Location_Name,
        city: location.Located_City,
        forecast,
        description
      };
    } catch (error) {
      console.error(`Error fetching data for ${location.Location_Name}:`, error);
      // Return basic data without description if there's an error
      const forecast = await get5DayForecast(location.Located_City);
      return {
        location: location.Location_Name,
        city: location.Located_City,
        forecast,
        description: ''
      };
    }
  });

  try {
    const results = await Promise.allSettled(weatherPromises);
    return results
      .filter((result): result is PromiseFulfilledResult<LocationWeather> => result.status === 'fulfilled')
      .map(result => result.value);
  } catch (error) {
    console.error('Error fetching weather for multiple locations:', error);
    return [];
  }
}

export function getWeatherIcon(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export async function getLocationDescription(locationName: string, city: string): Promise<string> {
  if (!genAI) {
    console.warn('Gemini API key not found');
    return '';
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Write a brief, engaging description (2-3 sentences) about ${locationName} in ${city}, Sri Lanka. Focus on what makes this place special for tourists - its key attractions, natural beauty, or cultural significance. Keep it concise and appealing.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text.trim();
  } catch (error) {
    console.error('Error generating location description:', error);
    return '';
  }
}
