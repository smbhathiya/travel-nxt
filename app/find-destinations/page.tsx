"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Search,
  Sun,
  Cloud,
  CloudRain,
  Droplets,
  Wind,
  ThumbsUp,
  Star,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

type WeatherForecast = {
  month: string;
  averageTemp: number;
  precipitation: number;
  icon: React.ReactNode;
  conditions: string;
};

type Recommendation = {
  id: number;
  name: string;
  country: string;
  description: string;
  matchScore: number;
  image: string;
  category: string;
  weatherForecasts: WeatherForecast[];
};

export default function FindDestinationsPage() {
  const { user, isLoaded } = useUser();
  const [country, setCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Mock user profile data - in a real app, you would get this from your database
  const userProfile = {
    interests: [], // Would be populated from database in real app
    previousDestinations: [], // Would be populated from database in real app
  };

  // Simulated AI recommendation function (would be replaced with actual API call)
  const getRecommendations = async () => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock recommendations based on user interests and previous destinations
    const mockRecommendations: Recommendation[] = [
      {
        id: 1,
        name: "Kyoto",
        country: "Japan",
        description:
          "Historical temples, traditional gardens, and authentic cultural experiences perfect for culture enthusiasts.",
        matchScore: 98,
        image: "/landing/landing-01.jpg",
        category: "Cultural",
        weatherForecasts: [
          {
            month: "June",
            averageTemp: 28,
            precipitation: 13,
            icon: <Sun />,
            conditions: "Warm & Humid",
          },
          {
            month: "July",
            averageTemp: 32,
            precipitation: 18,
            icon: <Cloud />,
            conditions: "Hot & Humid",
          },
          {
            month: "August",
            averageTemp: 33,
            precipitation: 14,
            icon: <CloudRain />,
            conditions: "Hot with Showers",
          },
        ],
      },
      {
        id: 2,
        name: "Barcelona",
        country: "Spain",
        description:
          "Stunning architecture, vibrant streets, and beautiful beaches, ideal for urban explorers.",
        matchScore: 95,
        image: "/landing/landing-01.jpg",
        category: "Urban",
        weatherForecasts: [
          {
            month: "June",
            averageTemp: 26,
            precipitation: 4,
            icon: <Sun />,
            conditions: "Warm & Sunny",
          },
          {
            month: "July",
            averageTemp: 29,
            precipitation: 2,
            icon: <Sun />,
            conditions: "Hot & Dry",
          },
          {
            month: "August",
            averageTemp: 30,
            precipitation: 5,
            icon: <Sun />,
            conditions: "Hot & Sunny",
          },
        ],
      },
      {
        id: 3,
        name: "Costa Rica",
        country: "Costa Rica",
        description:
          "Lush rainforests, diverse wildlife, and incredible hiking opportunities for nature lovers.",
        matchScore: 91,
        image: "/landing/landing-01.jpg",
        category: "Nature",
        weatherForecasts: [
          {
            month: "June",
            averageTemp: 26,
            precipitation: 28,
            icon: <Droplets />,
            conditions: "Warm & Rainy",
          },
          {
            month: "July",
            averageTemp: 26,
            precipitation: 25,
            icon: <Droplets />,
            conditions: "Warm & Rainy",
          },
          {
            month: "August",
            averageTemp: 26,
            precipitation: 26,
            icon: <Droplets />,
            conditions: "Warm & Rainy",
          },
        ],
      },
      {
        id: 4,
        name: "Santorini",
        country: "Greece",
        description:
          "Breathtaking views, white-washed buildings, and stunning sunsets perfect for couples and photographers.",
        matchScore: 88,
        image: "/landing/landing-01.jpg",
        category: "Island",
        weatherForecasts: [
          {
            month: "June",
            averageTemp: 26,
            precipitation: 1,
            icon: <Sun />,
            conditions: "Warm & Dry",
          },
          {
            month: "July",
            averageTemp: 27,
            precipitation: 0,
            icon: <Sun />,
            conditions: "Hot & Dry",
          },
          {
            month: "August",
            averageTemp: 28,
            precipitation: 0,
            icon: <Sun />,
            conditions: "Hot & Dry",
          },
        ],
      },
      {
        id: 5,
        name: "Queenstown",
        country: "New Zealand",
        description:
          "Adventure capital with stunning alpine scenery, perfect for outdoor enthusiasts.",
        matchScore: 85,
        image: "/landing/landing-01.jpg",
        category: "Mountains",
        weatherForecasts: [
          {
            month: "June",
            averageTemp: 5,
            precipitation: 70,
            icon: <CloudRain />,
            conditions: "Cold & Wet",
          },
          {
            month: "July",
            averageTemp: 4,
            precipitation: 65,
            icon: <CloudRain />,
            conditions: "Cold & Wet",
          },
          {
            month: "August",
            averageTemp: 6,
            precipitation: 60,
            icon: <Cloud />,
            conditions: "Cold",
          },
        ],
      },
    ];

    setRecommendations(mockRecommendations);
    setIsLoading(false);
    setShowRecommendations(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getRecommendations();
  };

  // Helper function to render weather icons
  const getWeatherIcon = (icon: React.ReactNode) => {
    return <div className="text-primary">{icon}</div>;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 pb-12">
        <div className="bg-muted py-12">
          <div className="container max-w-3xl mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Find Your Perfect Destination
              </h1>
              <p className="text-muted-foreground">
                Let our AI recommend destinations based on your interests and
                travel history
              </p>
            </div>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label
                        htmlFor="country"
                        className="text-sm font-medium mb-1 block"
                      >
                        Where would you like to go?
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="country"
                          placeholder="Enter a country or region"
                          className="pl-10"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? "Finding..." : "Find Destinations"}
                        {!isLoading && <Search className="ml-2 h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {(!userProfile.interests?.length ||
              !userProfile.previousDestinations?.length) &&
            user ? (
              <div className="bg-muted-foreground/10 rounded-lg p-4 text-center">
                <p className="font-medium">
                  Complete your profile for better recommendations
                </p>
                <p className="text-sm text-muted-foreground my-2">
                  {!userProfile.interests?.length
                    ? "Add your travel interests"
                    : ""}
                  {!userProfile.interests?.length &&
                  !userProfile.previousDestinations?.length
                    ? " and "
                    : ""}
                  {!userProfile.previousDestinations?.length
                    ? "add your travel history"
                    : ""}
                  {" to get personalized suggestions."}
                </p>
                <div className="flex justify-center gap-3 mt-4">
                  {!userProfile.interests?.length && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/interests">Add Interests</Link>
                    </Button>
                  )}
                  {!userProfile.previousDestinations?.length && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/previous-trips">Add Travel History</Link>
                    </Button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {showRecommendations && (
          <div className="container max-w-6xl mx-auto px-4 mt-12">
            <h2 className="text-2xl font-bold mb-6">
              Recommended Destinations for You
            </h2>
            <div className="space-y-6">
              {recommendations.map((recommendation) => (
                <Card key={recommendation.id} className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="relative h-64 md:h-auto">
                      <Image
                        src={recommendation.image}
                        alt={recommendation.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full px-2 py-1 text-sm font-medium flex items-center gap-1">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>{recommendation.matchScore}% Match</span>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/70 text-white rounded-full px-3 py-1 text-xs font-medium">
                        {recommendation.category}
                      </div>
                    </div>
                    <div className="p-6 col-span-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold">
                            {recommendation.name}
                          </h3>
                          <p className="text-muted-foreground">
                            {recommendation.country}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          <span className="ml-1 font-medium">
                            {4 + Math.random().toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <p className="mt-4">{recommendation.description}</p>

                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Weather Forecast</h4>
                        <div className="flex flex-wrap gap-4">
                          {recommendation.weatherForecasts.map(
                            (forecast, idx) => (
                              <div
                                key={idx}
                                className="flex flex-col items-center bg-muted p-3 rounded-md text-center"
                              >
                                <span className="text-xs font-medium text-muted-foreground">
                                  {forecast.month}
                                </span>
                                <div className="my-1">
                                  {getWeatherIcon(forecast.icon)}
                                </div>
                                <span className="font-medium">
                                  {forecast.averageTemp}°C
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {forecast.conditions}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button asChild>
                          <Link href={`/destination/${recommendation.id}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button variant="outline">Save</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
