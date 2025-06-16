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

    return [
      {
        month: new Date().toLocaleString("default", { month: "long" }),
        temperature: `${Math.round(weatherData.main?.temp || 20)}°C`,
        condition: weatherData.weather?.[0]?.description || "Clear",
        humidity: `${weatherData.main?.humidity || 50}%`,
        windSpeed: `${Math.round(weatherData.wind?.speed || 5)} m/s`,
      },
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
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a list of 5 popular tourist destinations in ${country}. 
    
    For each destination, provide these exact properties:
    - name: The destination name
    - description: A brief description (2-3 sentences)
    - bestTimeToVisit: Best time to visit
    - activities: Array of 3-4 main activities/attractions as simple strings
    
    IMPORTANT: Return ONLY a valid JSON array with no explanation text, markdown formatting, or code blocks.
    The response must be a proper JSON array that can be directly parsed with JSON.parse().
    
    Example of the expected format:
    [
      {
        "name": "Example Destination",
        "description": "Short description here.",
        "bestTimeToVisit": "Month to Month",
        "activities": ["Activity 1", "Activity 2", "Activity 3"]
      }
    ]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text(); 
    try {
      let jsonText = text.trim();

      const startIdx = jsonText.indexOf("[");
      const endIdx = jsonText.lastIndexOf("]");

      if (startIdx >= 0 && endIdx >= 0 && endIdx > startIdx) {
        jsonText = jsonText.substring(startIdx, endIdx + 1);
      }

      if (jsonText.includes("```")) {
        const codeBlockStart = jsonText.indexOf("```");
        let codeBlockContent = jsonText.substring(codeBlockStart + 3);
        const codeBlockEnd = codeBlockContent.lastIndexOf("```");

        if (codeBlockEnd >= 0) {
          codeBlockContent = codeBlockContent.substring(0, codeBlockEnd).trim();
          const firstLineBreak = codeBlockContent.indexOf("\n");
          if (firstLineBreak > 0) {
            codeBlockContent = codeBlockContent
              .substring(firstLineBreak)
              .trim();
          }
          jsonText = codeBlockContent;
        }
      }

      console.log("Cleaned JSON text:", jsonText);
      const rawDestinations = JSON.parse(jsonText);

      return Array.isArray(rawDestinations)
        ? rawDestinations.map((dest, index) => ({
            id: Date.now() + index,
            name: dest.name || `Destination ${index + 1}`,
            country: country,
            description: dest.description || "No description available.",
            matchScore: Math.floor(80 + Math.random() * 20), 
            image: "/landing/landing-01.jpg", 
            category: dest.bestTimeToVisit
              ? "Best: " + dest.bestTimeToVisit
              : "Travel",
            weatherForecasts: [],
            activities: dest.activities || [],
            bestTimeToVisit: dest.bestTimeToVisit,
          }))
        : [];
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      console.log("Raw response:", text);

      try {
        const nameMatch = /\"name\":\s*\"([^\"]+)\"/g;
        const names = [];
        let match;
        while ((match = nameMatch.exec(text)) !== null) {
          names.push(match[1]);
        }

        if (names.length > 0) {
          return names.map((name, index) => ({
            id: Date.now() + index,
            name: name,
            country: country,
            description: "Partial data recovered from API response.",
            matchScore: 80,
            image: "/landing/landing-01.jpg",
            category: "Travel",
            weatherForecasts: [],
            activities: [],
            bestTimeToVisit: "",
          }));
        }
      } catch (fallbackError) {
        console.error("Even fallback parsing failed:", fallbackError);
      }
      return [];
    }
  } catch (error) {
    console.error("Error fetching destinations from Gemini API:", error);
    return [];
  }
}
