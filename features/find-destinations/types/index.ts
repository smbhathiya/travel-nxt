export type WeatherForecast = {
  month: string;
  averageTemp: number;
  precipitation: number;
  icon: React.ElementType; // Changed from React.ReactNode to React.ElementType
  conditions: string;
};

export type Recommendation = {
  id: number;
  name: string;
  country: string;
  description: string;
  matchScore: number;
  image: string;
  category: string;
  weatherForecasts: WeatherForecast[];
  // New fields from Gemini API
  activities?: string[];
  bestTimeToVisit?: string;
};
