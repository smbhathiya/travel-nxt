import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Star, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Recommendation } from "../types";

export function RecommendationList({
  recommendations,
}: {
  recommendations: Recommendation[];
}) {
  const handleViewMore = (destinationName: string, country: string) => {
    const searchQuery = `${destinationName} ${country} travel destination`;
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      searchQuery
    )}`;
    window.open(googleSearchUrl, "_blank");
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 mt-12">
      <h2 className="text-2xl font-bold mb-10 text-center">
        Recommended Destinations for You
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {recommendations.map((recommendation) => (
          <Card
            key={recommendation.id}
            className="overflow-hidden rounded-lg shadow-sm border"
          >
            {/* Weather Badge - Only show weather badge */}
            <div className="relative p-4">
              {recommendation.weather && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge
                    variant="outline"
                    className="px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm border-blue-200"
                  >
                    <Image
                      src={`https://openweathermap.org/img/wn/${recommendation.weather.icon}.png`}
                      alt={recommendation.weather.condition}
                      width={16}
                      height={16}
                      className="w-4 h-4 mr-1"
                    />
                    <span className="text-xs font-medium text-blue-700">
                      {recommendation.weather.temperature}°C
                    </span>
                  </Badge>
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="p-5">
              {/* Destination Name and Rating */}
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-xl font-bold">{recommendation.name}</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                  <span className="text-sm font-medium">
                    {(4.5 + ((recommendation.id * 0.1) % 0.5)).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Country and Quick Weather */}
              <div className="flex justify-between items-center mb-3">
                <p className="text-muted-foreground text-sm">
                  {recommendation.country}
                </p>
                {recommendation.weather && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Image
                      src={`https://openweathermap.org/img/wn/${recommendation.weather.icon}.png`}
                      alt={recommendation.weather.condition}
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span>{recommendation.weather.temperature}°C</span>
                  </div>
                )}
              </div>
              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {recommendation.description}
              </p>

              {/* Current Weather */}
              {recommendation.weather && (
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Image
                            src={`https://openweathermap.org/img/wn/${recommendation.weather.icon}@2x.png`}
                            alt={recommendation.weather.condition}
                            width={40}
                            height={40}
                            className="w-10 h-10"
                          />
                        </div>
                        <div>
                          <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                            {recommendation.weather.temperature}°C
                          </div>
                          <p className="text-xs text-blue-600 dark:text-blue-400 capitalize font-medium">
                            {recommendation.weather.condition}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          <div className="flex items-center gap-1 mb-1">
                            <span>💧</span>
                            <span>{recommendation.weather.humidity}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>💨</span>
                            <span>{recommendation.weather.windSpeed} m/s</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Best Time To Visit */}
              {recommendation.bestTimeToVisit && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">
                    Best Time to Visit
                  </h4>
                  <div className="bg-muted/50 p-2 rounded-md">
                    <p className="text-sm">{recommendation.bestTimeToVisit}</p>
                  </div>
                </div>
              )}
              {/* Activities */}
              {recommendation.activities &&
                recommendation.activities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Top Activities</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {recommendation.activities
                        .slice(0, 3)
                        .map((activity, idx) => (
                          <li key={idx} className="text-muted-foreground">
                            {activity}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              {/* Weather Forecast - Only show if there are any */}
              {recommendation.weatherForecasts &&
                recommendation.weatherForecasts.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">
                      Weather Forecast
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {recommendation.weatherForecasts
                        .slice(0, 3)
                        .map((forecast, idx) => (
                          <div
                            key={idx}
                            className="bg-muted/50 p-2 rounded-md text-center"
                          >
                            <p className="text-xs text-muted-foreground">
                              {forecast.month}
                            </p>
                            <div className="my-1">
                              {forecast.icon && (
                                <forecast.icon className="h-4 w-4 mx-auto" />
                              )}
                            </div>
                            <p className="text-sm font-medium">
                              {forecast.averageTemp}°C
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    handleViewMore(recommendation.name, recommendation.country)
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View More
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
