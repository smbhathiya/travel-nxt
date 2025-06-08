"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  Sun,
  CloudRain,
  Droplets,
  Clock,
  Users,
  DollarSign,
  ThumbsUp,
  Star,
  Bookmark,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

type WeatherData = {
  month: string;
  averageTemp: number;
  precipitation: number;
  conditions: string;
  icon: React.ReactNode;
};

type DestinationDetails = {
  id: number;
  name: string;
  country: string;
  description: string;
  longDescription: string;
  matchScore: number;
  image: string;
  category: string;
  activities: string[];
  bestTimeToVisit: string;
  averageBudget: string;
  recommendedDuration: string;
  crowdLevel: string;
  weatherData: WeatherData[];
};

export default function DestinationDetailPage() {
  const params = useParams();
  const destinationId = params.id;
  const [destination, setDestination] = useState<DestinationDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const fetchDestinationDetails = async () => {
      // In a real app, this would be an API call using the destination ID
      setLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock destination data
      const mockDestination: DestinationDetails = {
        id: Number(destinationId),
        name: "Kyoto",
        country: "Japan",
        description:
          "Historical temples, traditional gardens, and authentic cultural experiences perfect for culture enthusiasts.",
        longDescription:
          "Kyoto, the cultural heart of Japan, is home to over 1,600 Buddhist temples, 400 Shinto shrines, and 17 UNESCO World Heritage sites. The city offers a perfect blend of historical architecture, traditional customs, and natural beauty. Visitors can explore ancient temples like Kinkaku-ji and Fushimi Inari Shrine, stroll through bamboo forests, witness geisha in the Gion district, and experience traditional tea ceremonies. The city is especially beautiful during cherry blossom season in spring and autumn when the maple trees display vibrant red foliage.",
        matchScore: 98,
        image: "/landing/landing-01.jpg",
        category: "Cultural",
        activities: [
          "Visit historic temples and shrines",
          "Experience a traditional tea ceremony",
          "Explore the bamboo forest in Arashiyama",
          "Witness geisha in the Gion district",
          "Stroll through traditional gardens",
        ],
        bestTimeToVisit: "March-May and October-November",
        averageBudget: "$100-150 per day",
        recommendedDuration: "5-7 days",
        crowdLevel: "Moderate to high during peak season",
        weatherData: [
          {
            month: "January",
            averageTemp: 6,
            precipitation: 50,
            conditions: "Cold & Dry",
            icon: <Sun />,
          },
          {
            month: "February",
            averageTemp: 6,
            precipitation: 60,
            conditions: "Cold & Dry",
            icon: <Sun />,
          },
          {
            month: "March",
            averageTemp: 10,
            precipitation: 110,
            conditions: "Mild & Wet",
            icon: <CloudRain />,
          },
          {
            month: "April",
            averageTemp: 15,
            precipitation: 130,
            conditions: "Mild & Wet",
            icon: <CloudRain />,
          },
          {
            month: "May",
            averageTemp: 20,
            precipitation: 140,
            conditions: "Warm & Wet",
            icon: <CloudRain />,
          },
          {
            month: "June",
            averageTemp: 24,
            precipitation: 230,
            conditions: "Warm & Wet",
            icon: <Droplets />,
          },
          {
            month: "July",
            averageTemp: 28,
            precipitation: 230,
            conditions: "Hot & Wet",
            icon: <Droplets />,
          },
          {
            month: "August",
            averageTemp: 29,
            precipitation: 140,
            conditions: "Hot & Wet",
            icon: <Droplets />,
          },
          {
            month: "September",
            averageTemp: 25,
            precipitation: 220,
            conditions: "Warm & Wet",
            icon: <CloudRain />,
          },
          {
            month: "October",
            averageTemp: 19,
            precipitation: 100,
            conditions: "Mild & Wet",
            icon: <Sun />,
          },
          {
            month: "November",
            averageTemp: 14,
            precipitation: 70,
            conditions: "Mild & Dry",
            icon: <Sun />,
          },
          {
            month: "December",
            averageTemp: 8,
            precipitation: 40,
            conditions: "Cold & Dry",
            icon: <Sun />,
          },
        ],
      };

      setDestination(mockDestination);
      setLoading(false);
    };

    fetchDestinationDetails();
  }, [destinationId]);

  // Function to save destination
  const toggleSaveDestination = () => {
    if (!user) {
      // In a real app, redirect to sign in or prompt user to sign in
      console.log("Please sign in to save this destination");
      return;
    }

    // In a real app, this would call an API to save to user's profile
    console.log(
      `${saved ? "Removing" : "Saving"} destination ${
        destination?.name
      } for user ${user.id}`
    );
    setSaved(!saved);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg">Loading destination information...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg">Destination not found</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 pb-16">
        {/* Hero Image */}
        <div className="relative h-80 md:h-96 lg:h-[500px] w-full">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
            <div className="container max-w-6xl mx-auto">
              <div className="flex justify-between items-end">
                <div>
                  <p className="flex items-center text-sm md:text-base mb-2">
                    <MapPin className="h-4 w-4 mr-1" /> {destination.country}
                  </p>
                  <h1 className="text-3xl md:text-5xl font-bold">
                    {destination.name}
                  </h1>
                </div>
                <div className="flex items-center bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-medium">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>{destination.matchScore}% Match</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-6xl mx-auto px-4">
          {/* Action Buttons */}
          <div className="flex justify-between items-center my-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-lg">{4.8}</span>
              <span className="text-muted-foreground">
                ({Math.floor(Math.random() * 1000) + 500} reviews)
              </span>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={toggleSaveDestination}
              >
                <Bookmark
                  className={`h-4 w-4 ${
                    saved ? "fill-primary text-primary" : ""
                  }`}
                />
                {saved ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Overview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {destination.longDescription}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Top Activities</h2>
                <ul className="space-y-2">
                  {destination.activities.map((activity, index) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">
                  Weather Throughout the Year
                </h2>
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-4 min-w-[800px]">
                    {destination.weatherData.map((data, index) => (
                      <Card key={index} className="min-w-[110px] flex-shrink-0">
                        <CardContent className="p-4 flex flex-col items-center">
                          <h3 className="font-medium">{data.month}</h3>
                          <div className="my-2 text-primary">{data.icon}</div>
                          <p className="font-bold">{data.averageTemp}°C</p>
                          <p className="text-xs text-muted-foreground">
                            {data.conditions}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {data.precipitation}mm
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <div>
              <Card>
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-lg font-bold">Travel Information</h3>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Best Time to Visit</h4>
                    </div>
                    <p className="text-muted-foreground ml-8">
                      {destination.bestTimeToVisit}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Average Budget</h4>
                    </div>
                    <p className="text-muted-foreground ml-8">
                      {destination.averageBudget}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Recommended Duration</h4>
                    </div>
                    <p className="text-muted-foreground ml-8">
                      {destination.recommendedDuration}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Crowd Level</h4>
                    </div>
                    <p className="text-muted-foreground ml-8">
                      {destination.crowdLevel}
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full">
                      {user ? "Plan Your Trip" : "Sign in to Plan Your Trip"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {user && (
                <div className="mt-6">
                  <h3 className="font-bold mb-3">Why This Matches You</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm bg-primary/10 p-3 rounded-lg">
                      <ThumbsUp className="h-4 w-4 text-primary" />
                      <span>Matches your interest in cultural experiences</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-primary/10 p-3 rounded-lg">
                      <ThumbsUp className="h-4 w-4 text-primary" />
                      <span>Similar to places you've visited before</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-primary/10 p-3 rounded-lg">
                      <ThumbsUp className="h-4 w-4 text-primary" />
                      <span>
                        Optimal weather during your preferred travel months
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
