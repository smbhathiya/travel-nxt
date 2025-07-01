"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Star, 
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
  ArrowLeft,
  Loader2,
  Share2,
  Bookmark,
  BookmarkCheck
} from "lucide-react";
import { Navbar } from "../../../components/landing/Navbar";
import { Footer } from "../../../components/landing/Footer";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast"; 

interface LocationData {
  Location_Name: string;
  Located_City: string;
  Location_Type: string;
  Rating: number;
  Sentiment: string;
  Sentiment_Score: number;
}

interface SimilarLocationData extends LocationData {
  similarity: number;
}

export default function LocationDetails({ params }: { params: { locationName: string } | Promise<{ locationName: string }> }) {
  const resolvedParams = React.use(Promise.resolve(params));
  
  const [locationDetails, setLocationDetails] = useState<LocationData | null>(null);
  const [similarLocations, setSimilarLocations] = useState<SimilarLocationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { toast } = useToast();
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  
  const locationName = decodeURIComponent(resolvedParams.locationName);

  useEffect(() => {
    const fetchLocationData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch location details
        const detailsResponse = await fetch(`/api/location-details/${encodeURIComponent(locationName)}`);
        
        if (!detailsResponse.ok) {
          throw new Error('Failed to fetch location details');
        }
        
        const detailsData = await detailsResponse.json();
        if (Array.isArray(detailsData) && detailsData.length > 0) {
          setLocationDetails(detailsData[0]);
        } else if (detailsData.error) {
          throw new Error(detailsData.error);
        } else {
          throw new Error('No details found for this location');
        }
        
        // Fetch similar locations
        const similarResponse = await fetch(`/api/similar-locations/${encodeURIComponent(locationName)}`);
        
        if (!similarResponse.ok) {
          throw new Error('Failed to fetch similar locations');
        }
        
        const similarData = await similarResponse.json();
        if (Array.isArray(similarData)) {
          setSimilarLocations(similarData);
        } else if (similarData.error) {
          console.error('Error fetching similar locations:', similarData.error);
          // Don't throw here, we can still show the page without similar locations
        }
        
      } catch (error) {
        console.error('Error fetching location data:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLocationData();
  }, [locationName]);
  
  // Check if location is bookmarked
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!isSignedIn || !locationDetails) return;
      
      try {
        const response = await fetch('/api/bookmarks');
        
        if (response.ok) {
          const { bookmarks } = await response.json();
          const isBookmarked = bookmarks.some(
            (bookmark: { locationName: string; locatedCity: string }) => 
              bookmark.locationName === locationDetails.Location_Name && 
              bookmark.locatedCity === locationDetails.Located_City
          );
          setIsBookmarked(isBookmarked);
        }
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };
    
    checkBookmarkStatus();
  }, [isSignedIn, locationDetails]);

  // Handle bookmarking
  const handleBookmark = async () => {
    if (!isSignedIn) {
      // Redirect to sign in if not signed in
      router.push('/sign-in');
      return;
    }
    
    if (!locationDetails) return;
    
    setBookmarkLoading(true);
    
    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch('/api/bookmarks', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            locationName: locationDetails.Location_Name,
            locatedCity: locationDetails.Located_City
          })
        });
        
        if (response.ok) {
          setIsBookmarked(false);
          toast({
            title: "Removed from bookmarks",
            description: `${locationDetails.Location_Name} has been removed from your bookmarks.`
          });
        }
      } else {
        // Add bookmark
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            locationName: locationDetails.Location_Name,
            locatedCity: locationDetails.Located_City,
            locationType: locationDetails.Location_Type,
            rating: locationDetails.Rating,
            personalizedScore: locationDetails.Sentiment_Score
          })
        });
        
        if (response.ok) {
          setIsBookmarked(true);
          toast({
            title: "Added to bookmarks",
            description: `${locationDetails.Location_Name} has been saved to your bookmarks.`
          });
        } else if (response.status === 409) {
          toast({
            title: "Already bookmarked",
            description: "This location is already in your bookmarks."
          });
        }
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
      toast({
        title: "Error",
        description: "There was a problem updating your bookmarks.",
        variant: "destructive"
      });
    } finally {
      setBookmarkLoading(false);
    }
  };

  // Function to get icon based on location type
  const getLocationIcon = (locationType: string) => {
    const iconClass = "h-5 w-5";
    switch (locationType?.toLowerCase()) {
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

  // Share function
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: locationDetails?.Location_Name || 'Check out this destination',
        text: `Check out ${locationDetails?.Location_Name} in ${locationDetails?.Located_City}, Sri Lanka!`,
        url: window.location.href
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast({
            title: "Link copied!",
            description: "Share link has been copied to clipboard."
          });
        })
        .catch((error) => console.error('Error copying link:', error));
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            className="mb-6 pl-0"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-1/3" />
              </div>
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Error</h2>
              <p>{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => router.push('/locations')}
              >
                Go to Search
              </Button>
            </div>
          ) : locationDetails ? (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold">{locationDetails.Location_Name}</h1>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button 
                      variant={isBookmarked ? "default" : "outline"} 
                      size="sm" 
                      onClick={handleBookmark}
                      disabled={bookmarkLoading}
                    >
                      {bookmarkLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : isBookmarked ? (
                        <BookmarkCheck className="h-4 w-4 mr-2" />
                      ) : (
                        <Bookmark className="h-4 w-4 mr-2" />
                      )}
                      {isBookmarked ? "Saved" : "Save"}
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    {getLocationIcon(locationDetails.Location_Type)}
                    <span className="text-muted-foreground">
                      {locationDetails.Location_Type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span className="text-muted-foreground">
                      {locationDetails.Located_City}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">
                        {locationDetails.Rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hero Image - This would be a real image in a production app */}
                <div className="rounded-lg bg-muted/50 h-[300px] flex items-center justify-center overflow-hidden">
                  <div className="text-center">
                    <div className="bg-background/50 backdrop-blur-sm p-4 rounded-md inline-block">
                      <MapPin className="h-12 w-12 mx-auto text-primary/50" />
                      <p className="mt-2 text-muted-foreground">Location Image</p>
                    </div>
                  </div>
                </div>

                {/* Sentiment data */}
                <Card className="overflow-hidden mt-6">
                  <CardContent className="p-6">
                    <h2 className="font-bold text-xl mb-4">Visitor Sentiment</h2>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-md ${
                          locationDetails.Sentiment === "Positive" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          <Star className="h-4 w-4 fill-current" />
                          <span>{locationDetails.Sentiment} Experience</span>
                        </div>
                        <p className="mt-3 text-muted-foreground">
                          {locationDetails.Sentiment === "Positive" 
                            ? `${(locationDetails.Sentiment_Score * 100).toFixed(0)}% of visitors reported a positive experience at this destination.`
                            : `Only ${(locationDetails.Sentiment_Score * 100).toFixed(0)}% of visitors reported a positive experience at this destination.`
                          }
                        </p>
                      </div>
                      <div className="relative h-24 w-24">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">
                            {(locationDetails.Sentiment_Score * 100).toFixed(0)}%
                          </span>
                        </div>
                        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                          <circle
                            className="stroke-muted-foreground/20"
                            strokeWidth="8"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className={`${locationDetails.Sentiment === "Positive" ? "stroke-green-500" : "stroke-red-500"}`}
                            strokeWidth="8"
                            strokeDasharray={`${locationDetails.Sentiment_Score * 251} 251`}
                            strokeLinecap="round"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* About this location - This would be real data in a production app */}
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="font-bold text-xl mb-4">About {locationDetails.Location_Name}</h2>
                    <p className="text-muted-foreground">
                      {locationDetails.Location_Name} is a popular destination located in {locationDetails.Located_City}. 
                      This {locationDetails.Location_Type.toLowerCase()} offers visitors a {locationDetails.Sentiment.toLowerCase()} experience 
                      with a rating of {locationDetails.Rating.toFixed(1)} out of 5.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Similar locations */}
              {similarLocations.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Similar Destinations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {similarLocations.map((location, index) => (
                      <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg leading-tight mb-2">
                                <Button 
                                  variant="link" 
                                  className="p-0 h-auto text-left justify-start hover:no-underline"
                                  onClick={() => router.push(`/locations/${encodeURIComponent(location.Location_Name)}`)}
                                >
                                  {location.Location_Name}
                                </Button>
                              </h3>
                              <div className="flex items-center gap-2 mb-3">
                                {getLocationIcon(location.Location_Type)}
                                <span className="text-sm text-muted-foreground">
                                  {location.Located_City}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-semibold">
                                  {location.Rating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="inline-block bg-secondary/50 text-secondary-foreground text-sm font-medium px-3 py-1 rounded-full">
                              {location.Location_Type}
                            </span>
                            <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
                              location.Sentiment === "Positive" 
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                              {location.Sentiment}
                            </span>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-border">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Similarity</span>
                              <span className="text-sm font-medium">
                                {(location.similarity * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full bg-muted h-2 rounded-full mt-1.5">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{width: `${location.similarity * 100}%`}}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <Footer />
    </div>
  );
}
