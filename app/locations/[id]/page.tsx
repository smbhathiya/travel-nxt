"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ArrowLeft } from "lucide-react";
import { Navbar } from "../../../components/landing/Navbar";
import { Footer } from "../../../components/landing/Footer";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

interface LocationData {
  id: string;
  name: string;
  type: string;
  locatedCity: string;
  about: string;
  overallRating: number;
  unsplashImage: string;
  feedbacks: unknown[];
}

export default function LocationDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [locationDetails, setLocationDetails] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    const fetchLocationData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const detailsResponse = await fetch(`/api/location-details/${id}`);
        if (!detailsResponse.ok) {
          throw new Error('Failed to fetch location details');
        }
        const detailsData = await detailsResponse.json();
        if (detailsData && !detailsData.error) {
          setLocationDetails(detailsData);
        } else if (detailsData.error) {
          throw new Error(detailsData.error);
        } else {
          throw new Error('No details found for this location');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching data';
        setError(errorMessage);
        console.error('Error fetching location data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocationData();
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to results
          </Button>
          {isLoading ? (
            <div className="space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/3" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Skeleton className="h-64 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-24 rounded-lg" />
                  <Skeleton className="h-24 rounded-lg" />
                  <Skeleton className="h-24 rounded-lg" />
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center border rounded-lg bg-background">
              <h2 className="text-2xl font-bold mb-4">Error</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => router.push('/locations')}>
                Return to Location Search
              </Button>
            </div>
          ) : locationDetails ? (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-4xl font-bold">{locationDetails.name}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>{locationDetails.locatedCity || 'Sri Lanka'}</span>
                    {locationDetails.type && (
                      <>
                        <span className="mx-1">•</span>
                        <span className="capitalize">{locationDetails.type}</span>
                      </>
                    )}
                  </div>
                </div>
                {/* Bookmark/share logic can be added here as needed */}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  {/* Main location image */}
                  <div className="bg-accent rounded-lg h-64 flex items-center justify-center mb-6 overflow-hidden relative">
                    {locationDetails.unsplashImage && (
                      <Image src={locationDetails.unsplashImage} alt={locationDetails.name} fill className="object-cover w-full h-full absolute inset-0" />
                    )}
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">About {locationDetails.name}</h2>
                    <p className="text-muted-foreground">
                      {locationDetails.about}
                    </p>
                  </div>
                </div>
                <div>
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Location Details</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type</span>
                          <span className="font-medium capitalize">{locationDetails.type || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">City</span>
                          <span className="font-medium">{locationDetails.locatedCity || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">{locationDetails.overallRating?.toFixed(1) || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              {/* Feedbacks and other sections can be added here */}
            </>
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
}
