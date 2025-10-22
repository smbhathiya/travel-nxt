export type WeatherData = {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
};

export type WeatherForecast = {
  month: string;
  averageTemp: number;
  precipitation: number;
  icon: React.ElementType;
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
  activities?: string[];
  bestTimeToVisit?: string;
  weather?: WeatherData | null;
};
