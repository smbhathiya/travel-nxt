// Weather service using OpenWeather API and Gemini API
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

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const descriptionCache = new Map<string, string>();

const cityMappings: Record<string, string> = {
  'Bentota': 'Bentota',
  'Kalkudah': 'Batticaloa', 
  'Nilaveli': 'Trincomalee',
  'Mirissa': 'Matara', 
  'Colombo': 'Colombo',
  'Arugam Bay': 'Ampara', 
  'Hikkaduwa': 'Galle',
  'Trincomalee': 'Trincomalee',
  'Unawatuna': 'Galle',
  'Kalutara': 'Kalutara'
};

function generateFallbackWeather(): WeatherForecast[] {
  const today = new Date();
  const fallbackData: WeatherForecast[] = [];
  
  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    fallbackData.push({
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      temp: Math.round(27 + Math.random() * 5), 
      description: i % 2 === 0 ? 'partly cloudy' : 'scattered showers',
      icon: i % 2 === 0 ? '02d' : '10d',
      humidity: Math.round(75 + Math.random() * 15),
      windSpeed: Math.round(8 + Math.random() * 7) 
    });
  }
  
  return fallbackData;
}

let lastGeminiCall = 0;
const GEMINI_RATE_LIMIT = 2000; 

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function get5DayForecast(city: string): Promise<WeatherForecast[]> {
  if (!OPENWEATHER_API_KEY) {
    console.warn('OpenWeather API key not found');
    return [];
  }

  try {
    const mappedCity = cityMappings[city] || city;
    const cityVariations = [
      mappedCity,
      city,
      city.split(' ')[0], 
      city.replace(/\s+/g, ''), 
    ];

    let response;
    let data;

    for (const cityVariation of cityVariations) {
      try {
        response = await fetch(
          `${OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(cityVariation)},LK&appid=${OPENWEATHER_API_KEY}&units=metric`
        );

        if (response.ok) {
          data = await response.json();
          console.log(`Weather found for ${city} using ${cityVariation}`);
          break;
        }
      } catch (err) {
        console.log(`Failed to fetch weather for ${cityVariation}:`, err);
        continue;
      }
    }

    if (!response || !response.ok || !data) {
      console.warn(`Weather data not found for ${city}, using fallback data`);
      return generateFallbackWeather();
    }
    
 
    const dailyForecasts: WeatherForecast[] = [];
    const processedDates = new Set();

    for (const item of data.list) {
      const date = new Date(item.dt * 1000);
      const dateString = date.toDateString();
      
      if (processedDates.has(dateString)) continue;
      
      const hour = date.getHours();
      if (hour < 9 || hour > 15) continue; 
      
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
        windSpeed: Math.round(item.wind.speed * 3.6) 
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
  const batchSize = 3;
  const results: LocationWeather[] = [];
  
  for (let i = 0; i < locations.length; i += batchSize) {
    const batch = locations.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (location) => {
      try {
        const forecast = await get5DayForecast(location.Located_City);
        
        const description = await getLocationDescription(location.Location_Name, location.Located_City);
        
        return {
          location: location.Location_Name,
          city: location.Located_City,
          forecast: forecast || [],
          description: description || `${location.Location_Name} is a beautiful destination in ${location.Located_City}, Sri Lanka.`
        };
      } catch (error) {
        console.error(`Error fetching data for ${location.Location_Name}:`, error);
        return {
          location: location.Location_Name,
          city: location.Located_City,
          forecast: generateFallbackWeather(),
          description: `${location.Location_Name} is a beautiful destination in ${location.Located_City}, Sri Lanka.`
        };
      }
    });

    try {
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      if (i + batchSize < locations.length) {
        await delay(1000); 
      }
    } catch (error) {
      console.error('Error processing batch:', error);
    }
  }

  return results;
}

export function getWeatherIcon(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export async function getLocationDescription(locationName: string, city: string): Promise<string> {
  const cacheKey = `${locationName}-${city}`;
  if (descriptionCache.has(cacheKey)) {
    return descriptionCache.get(cacheKey)!;
  }

  const fallbackDescription = `${locationName} is a beautiful destination in ${city}, Sri Lanka, known for its natural beauty and cultural significance.`;
  
  if (!genAI) {
    console.warn('Gemini API key not found');
    descriptionCache.set(cacheKey, fallbackDescription);
    return fallbackDescription;
  }

  try {
    const now = Date.now();
    const timeSinceLastCall = now - lastGeminiCall;
    if (timeSinceLastCall < GEMINI_RATE_LIMIT) {
      await delay(GEMINI_RATE_LIMIT - timeSinceLastCall);
    }
    lastGeminiCall = Date.now();

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 100, 
        temperature: 0.7,
      },
    });
    
    const prompt = `Write a brief description (1-2 sentences, max 50 words) about ${locationName} in ${city}, Sri Lanka. Focus on its main attraction for tourists.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const description = text.trim();
    descriptionCache.set(cacheKey, description);
    return description;
  } catch (error) {
    console.error('Error generating location description:', error);
    // Cache and return fallback description
    descriptionCache.set(cacheKey, fallbackDescription);
    return fallbackDescription;
  }
}
