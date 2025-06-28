"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Star,
  Loader2,
  Waves,
  Mountain,
  Landmark,
  TreePine,
  Flower2,
  Shield,
  Trees,
  Church,
  Building2,
  Fish,
  Camera,
  Cloud,
  Droplets,
  Wind,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Recommendation {
  Location_Name: string;
  Located_City: string;
  Location_Type: string;
  Rating: number;
  personalized_score: number;
}

interface WeatherForecast {
  date: string;
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

interface LocationWeather {
  location: string;
  city: string;
  forecast: WeatherForecast[];
  description: string;
}

export default function FindDestinationsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [weatherData, setWeatherData] = useState<LocationWeather[]>([]);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [hasInterests, setHasInterests] = useState(false);
  const [bookmarkedLocations, setBookmarkedLocations] = useState<Set<string>>(
    new Set()
  );
  const [bookmarkLoading, setBookmarkLoading] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetchUserInterests();
  }, [user]);

  // Auto-fetch recommendations when user has interests
  useEffect(() => {
    if (hasInterests && userInterests.length > 0 && !isLoading) {
      fetchRecommendations();
    }
  }, [hasInterests, userInterests]);

  // Auto-fetch recommendations when user has interests
  useEffect(() => {
    if (hasInterests && userInterests.length > 0) {
      fetchRecommendations();
    }
  }, [hasInterests, userInterests]);

  // Fetch user bookmarks
  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchUserInterests = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/user/interests");
      if (response.ok) {
        const data = await response.json();
        setUserInterests(data.interests);
        const hasUserInterests = data.interests && data.interests.length > 0;
        setHasInterests(hasUserInterests);
      }
    } catch (error) {
      console.error("Error fetching user interests:", error);
    }
  };

  const fetchRecommendations = async () => {
    if (!hasInterests) return;

    setIsLoading(true);
    setIsWeatherLoading(true);
    try {
      // Fetch recommendations
      const response = await fetch("/api/recommendations", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      const recs = data.recommendations || [];
      setRecommendations(recs);

      // Fetch weather data for the recommended locations
      if (recs.length > 0) {
        try {
          const weatherResponse = await fetch("/api/weather", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              locations: recs.map((rec: Recommendation) => ({
                Location_Name: rec.Location_Name,
                Located_City: rec.Located_City,
              })),
            }),
          });

          if (weatherResponse.ok) {
            const weatherData = await weatherResponse.json();
            setWeatherData(weatherData.weatherData || []);
          }
        } catch (weatherError) {
          console.error("Error fetching weather data:", weatherError);
        } finally {
          setIsWeatherLoading(false);
        }
      } else {
        setIsWeatherLoading(false);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setIsWeatherLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user bookmarks
  const fetchBookmarks = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/bookmarks");
      if (response.ok) {
        const data = await response.json();
        const bookmarkedSet = new Set<string>(
          data.bookmarks.map(
            (bookmark: { locationName: string; locatedCity: string }) =>
              `${bookmark.locationName}-${bookmark.locatedCity}`
          )
        );
        setBookmarkedLocations(bookmarkedSet);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  const handleBookmark = async (rec: Recommendation) => {
    if (!user) return;

    const locationKey = `${rec.Location_Name}-${rec.Located_City}`;
    const isBookmarked = bookmarkedLocations.has(locationKey);

    // Add to loading set
    setBookmarkLoading((prev) => new Set(prev).add(locationKey));

    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch("/api/bookmarks", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            locationName: rec.Location_Name,
            locatedCity: rec.Located_City,
          }),
        });

        if (response.ok) {
          setBookmarkedLocations((prev) => {
            const newSet = new Set(prev);
            newSet.delete(locationKey);
            return newSet;
          });
        }
      } else {
        // Add bookmark
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            locationName: rec.Location_Name,
            locatedCity: rec.Located_City,
            locationType: rec.Location_Type,
            rating: rec.Rating,
            personalizedScore: rec.personalized_score,
          }),
        });

        if (response.ok) {
          setBookmarkedLocations((prev) => new Set(prev).add(locationKey));
        } else if (response.status === 409) {
          // Already bookmarked
          setBookmarkedLocations((prev) => new Set(prev).add(locationKey));
        }
      }
    } catch (error) {
      console.error("Error handling bookmark:", error);
    } finally {
      // Remove from loading set
      setBookmarkLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(locationKey);
        return newSet;
      });
    }
  };

  // Function to get icon based on location type
  const getLocationIcon = (locationType: string) => {
    const iconClass = "h-5 w-5";
    switch (locationType.toLowerCase()) {
      case "beaches":
        return <Waves className={iconClass} />;
      case "bodies of water":
        return <Fish className={iconClass} />;
      case "farms":
        return <TreePine className={iconClass} />;
      case "gardens":
        return <Flower2 className={iconClass} />;
      case "historic sites":
        return <Landmark className={iconClass} />;
      case "museums":
        return <Building2 className={iconClass} />;
      case "national parks":
        return <Shield className={iconClass} />;
      case "nature & wildlife areas":
        return <Trees className={iconClass} />;
      case "waterfalls":
        return <Mountain className={iconClass} />;
      case "zoological gardens":
        return <Camera className={iconClass} />;
      case "religious sites":
        return <Church className={iconClass} />;
      default:
        return <MapPin className={iconClass} />;
    }
  };

  // Function to get weather data for a specific location
  const getLocationWeather = (
    locationName: string
  ): LocationWeather | undefined => {
    return weatherData.find((weather) => weather.location === locationName);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Discover Travel Locations in Sri Lanka
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get personalized recommendations for amazing destinations in Sri
              Lanka based on your interests
            </p>
          </div>

          {!hasInterests ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  To get personalized recommendations, please set your travel
                  interests first.
                </p>
                <Button asChild>
                  <a href="/interests">Set Your Interests</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="text-center bg-muted/30 rounded-xl p-6 border border-muted">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Your interests:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {userInterests.slice(0, 3).map((interest, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                      {userInterests.length > 3 && (
                        <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                          +{userInterests.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/interests")}
                    className="text-xs h-auto py-1 px-3 border border-primary/20 hover:border-primary"
                  >
                    Edit Interests
                  </Button>
                </div>

                {isLoading && recommendations.length === 0 ? (
                  <div className="flex items-center justify-center gap-2 py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-muted-foreground">
                      Getting your personalized recommendations...
                    </span>
                  </div>
                ) : (
                  <Button
                    onClick={fetchRecommendations}
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                    className="border-primary/20 hover:border-primary"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Refreshing...
                      </>
                    ) : (
                      "Refresh Recommendations"
                    )}
                  </Button>
                )}
              </div>

              {recommendations.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {recommendations.map((rec, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:bg-accent/50"
                    >
                      <CardContent className="p-6">
                        {/* Header with location name and ratings */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-xl leading-tight mb-2 text-foreground">
                              {rec.Location_Name}
                            </h3>
                            <div className="flex items-center gap-2 mb-3">
                              {getLocationIcon(rec.Location_Type)}
                              <span className="text-base font-medium text-muted-foreground">
                                {rec.Located_City}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {/* Rating */}
                            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-semibold">
                                {rec.Rating.toFixed(1)}
                              </span>
                            </div>
                            {/* Match Score - same size as rating */}
                            <div className="flex items-center gap-1 bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded-full">
                              <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-xs font-bold text-primary-foreground">
                                  %
                                </span>
                              </div>
                              <span className="text-sm font-semibold text-primary">
                                {(rec.personalized_score * 100).toFixed(0)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Location type */}
                        <div className="mb-4">
                          <span className="inline-block bg-secondary/50 text-secondary-foreground text-sm font-medium px-3 py-1 rounded-full capitalize">
                            {rec.Location_Type}
                          </span>
                        </div>

                        {/* Location Description */}
                        {(() => {
                          const locationWeather = getLocationWeather(
                            rec.Location_Name
                          );

                          // Show skeleton while weather/description is loading
                          if (isWeatherLoading) {
                            return (
                              <div className="mb-4">
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-3/4" />
                              </div>
                            );
                          }

                          // Show description if available
                          if (locationWeather?.description) {
                            return (
                              <div className="mb-4">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {locationWeather.description}
                                </p>
                              </div>
                            );
                          }

                          return null;
                        })()}

                        {/* Weather Forecast */}
                        {(() => {
                          const locationWeather = getLocationWeather(
                            rec.Location_Name
                          );

                          // Show skeleton while weather is loading
                          if (isWeatherLoading) {
                            return (
                              <div className="border-t pt-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <Skeleton className="h-4 w-4" />
                                  <Skeleton className="h-4 w-32" />
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                  {Array.from({ length: 5 }).map((_, idx) => (
                                    <div key={idx} className="text-center">
                                      <Skeleton className="h-3 w-8 mx-auto mb-1" />
                                      <Skeleton className="h-8 w-8 mx-auto mb-1" />
                                      <Skeleton className="h-3 w-8 mx-auto mb-1" />
                                      <Skeleton className="h-3 w-12 mx-auto" />
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-3 pt-3 border-t border-muted/50">
                                  <div className="grid grid-cols-2 gap-3">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-16" />
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          // Show weather data if available
                          if (
                            locationWeather &&
                            locationWeather.forecast &&
                            locationWeather.forecast.length > 0
                          ) {
                            return (
                              <div className="border-t pt-4">
                                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                  <Cloud className="h-4 w-4" />
                                  5-Day Weather Forecast
                                </h4>
                                <div className="grid grid-cols-5 gap-2">
                                  {locationWeather.forecast
                                    .slice(0, 5)
                                    .map((day, idx) => (
                                      <div key={idx} className="text-center">
                                        <div className="text-xs text-muted-foreground mb-1">
                                          {day.date.split(" ")[0]}
                                        </div>
                                        <img
                                          src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                                          alt={day.description}
                                          className="w-8 h-8 mx-auto mb-1"
                                        />
                                        <div className="text-xs font-medium">
                                          {day.temp}°C
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {day.description.split(" ")[0]}
                                        </div>
                                      </div>
                                    ))}
                                </div>

                                {/* Today's detailed weather */}
                                {locationWeather.forecast[0] && (
                                  <div className="mt-3 pt-3 border-t border-muted/50">
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                      <div className="flex items-center gap-1">
                                        <Droplets className="h-3 w-3 text-blue-500" />
                                        <span>
                                          {locationWeather.forecast[0].humidity}
                                          % humidity
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Wind className="h-3 w-3 text-gray-500" />
                                        <span>
                                          {
                                            locationWeather.forecast[0]
                                              .windSpeed
                                          }{" "}
                                          km/h
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          }

                          // Show "no weather data" message if weather loading is complete but no data
                          if (!isWeatherLoading) {
                            return (
                              <div className="border-t pt-4">
                                <div className="text-center py-4">
                                  <Cloud className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                                  <p className="text-sm text-muted-foreground">
                                    No weather data available
                                  </p>
                                </div>
                              </div>
                            );
                          }

                          return null;
                        })()}

                        {/* Action Buttons */}
                        <div className="mt-4 pt-4 border-t border-muted/30">
                          <div className="flex gap-2">
                            {/* Bookmark Button */}
                            <Button
                              variant={
                                bookmarkedLocations.has(
                                  `${rec.Location_Name}-${rec.Located_City}`
                                )
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              className="flex-1"
                              onClick={() => handleBookmark(rec)}
                              disabled={bookmarkLoading.has(
                                `${rec.Location_Name}-${rec.Located_City}`
                              )}
                            >
                              {bookmarkLoading.has(
                                `${rec.Location_Name}-${rec.Located_City}`
                              ) ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : bookmarkedLocations.has(
                                  `${rec.Location_Name}-${rec.Located_City}`
                                ) ? (
                                <BookmarkCheck className="h-4 w-4 mr-2" />
                              ) : (
                                <Bookmark className="h-4 w-4 mr-2" />
                              )}
                              {bookmarkedLocations.has(
                                `${rec.Location_Name}-${rec.Located_City}`
                              )
                                ? "Bookmarked"
                                : "Bookmark"}
                            </Button>

                            {/* View More Info Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                const searchQuery = `${rec.Location_Name} ${rec.Located_City} Sri Lanka tourist attractions`;
                                const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
                                  searchQuery
                                )}`;
                                window.open(
                                  googleSearchUrl,
                                  "_blank",
                                  "noopener,noreferrer"
                                );
                              }}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              More Info
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
