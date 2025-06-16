"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getWeatherForecasts(country: string) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  console.log("OPENWEATHER_API_KEY:", apiKey ? "present" : "undefined");

  if (!apiKey) {
    console.log("OpenWeather API key not found");
    return null;
  }

  try {
    // Get capital city from REST Countries API
    const countryResponse = await fetch(
      `https://restcountries.com/v3.1/name/${country}`
    );
    const countryData = await countryResponse.json();
    const capital = countryData[0]?.capital?.[0] || country;

    // Get weather data from OpenWeather API
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
    );
    const weatherData = await weatherResponse.json();

    // Return weather forecasts for the next 3 months (mock data based on current weather)
    return [
      {
        month: new Date().toLocaleString("default", { month: "long" }),
        temperature: `${Math.round(weatherData.main?.temp || 20)}°C`,
        condition: weatherData.weather?.[0]?.description || "Clear",
        humidity: `${weatherData.main?.humidity || 50}%`,
        windSpeed: `${Math.round(weatherData.wind?.speed || 5)} m/s`,
      },
      // Add more months as needed
    ];
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

export async function getDestinationsByCountry(country: string) {
  // Get API key the same way as your working API route
  const geminiApiKey = process.env.GEMINI_API_KEY;

  console.log("GEMINI_API_KEY:", geminiApiKey ? "present" : "undefined");
  console.log("Gemini API Key present:", !!geminiApiKey);

  if (!geminiApiKey) {
    console.log("Gemini API key not found in environment variables");
    return [];
  }

  try {
    // Initialize GoogleGenerativeAI the same way as your API route
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate a list of 5 popular tourist destinations in ${country}. 
    For each destination, provide:
    - name: The destination name
    - description: A brief description (2-3 sentences)
    - bestTimeToVisit: Best time to visit
    - activities: Array of 3-4 main activities/attractions
    
    Return the response as a valid JSON array of objects with these exact properties.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      const rawDestinations = JSON.parse(text);

      // Transform the raw data to match our Recommendation type
      return Array.isArray(rawDestinations)
        ? rawDestinations.map((dest, index) => ({
            id: Date.now() + index,
            name: dest.name,
            country: country,
            description: dest.description,
            matchScore: Math.floor(80 + Math.random() * 20), // Random score between 80-99
            image: "/landing/landing-01.jpg", // Default image
            category: dest.bestTimeToVisit
              ? "Best: " + dest.bestTimeToVisit
              : "Travel",
            weatherForecasts: [],
            // Additional data we'll keep but won't be used by the existing UI
            activities: dest.activities || [],
            bestTimeToVisit: dest.bestTimeToVisit,
          }))
        : [];
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      console.log("Raw response:", text);
      return [];
    }
  } catch (error) {
    console.error("Error fetching destinations from Gemini API:", error);
    return [];
  }
}
