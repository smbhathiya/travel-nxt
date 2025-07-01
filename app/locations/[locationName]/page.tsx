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

export default function LocationDetails({ params }: { params: Promise<{ locationName: string }> }) {
  // Unwrap params using React.use() as required in Next.js 15
  const { locationName: encodedLocationName } = React.use(params);
  const locationName = decodeURIComponent(encodedLocationName);
  
  const [locationDetails, setLocationDetails] = useState<LocationData | null>(null);
  const [similarLocations, setSimilarLocations] = useState<SimilarLocationData[]>([]);
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
          setSimilarLocations(similarData.slice(0, 6)); // Limit to 6 similar locations
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching data';
        setError(errorMessage);
        console.error('Error fetching location data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Check if the location is bookmarked
    const checkBookmarked = async () => {
      if (!isSignedIn) return;
      
      try {
        const response = await fetch('/api/bookmarks');
        if (response.ok) {
          const data = await response.json();
          
          // Handle both direct array and object with bookmarks property
          let bookmarks;
          if (Array.isArray(data)) {
            bookmarks = data;
          } else if (data.bookmarks && Array.isArray(data.bookmarks)) {
            bookmarks = data.bookmarks;
          } else {
            console.warn('Unexpected bookmarks response format:', data);
            setIsBookmarked(false);
            return;
          }
          
          setIsBookmarked(
            bookmarks.some((bookmark: { locationName: string }) => 
              bookmark.locationName.toLowerCase() === locationName.toLowerCase()
            )
          );
        }
      } catch (err) {
        console.error('Error checking bookmarks:', err);
      }
    };

    fetchLocationData();
    checkBookmarked();
  }, [locationName, isSignedIn]);

  const handleBookmarkToggle = async () => {
    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark locations",
        variant: "destructive",
      });
      return;
    }

    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch('/api/bookmarks', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ locationName })
        });

        if (response.ok) {
          setIsBookmarked(false);
          toast({
            title: "Removed from bookmarks",
            description: `${locationName} has been removed from your bookmarks`,
          });
        } else {
          throw new Error('Failed to remove bookmark');
        }
      } else {
        // Add bookmark
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            locationName,
            locationType: locationDetails?.Location_Type || 'Unknown',
            rating: locationDetails?.Rating || 0
          })
        });

        if (response.ok) {
          setIsBookmarked(true);
          toast({
            title: "Added to bookmarks",
            description: `${locationName} has been added to your bookmarks`,
          });
        } else {
          throw new Error('Failed to add bookmark');
        }
      }
    } catch (err) {
      toast({
        title: "Action failed",
        description: "There was a problem updating your bookmarks",
        variant: "destructive",
      });
      console.error('Error toggling bookmark:', err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const getLocationIcon = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'beach':
        return <Waves className="h-5 w-5" />;
      case 'mountain':
        return <Mountain className="h-5 w-5" />;
      case 'landmark':
        return <Landmark className="h-5 w-5" />;
      case 'forest':
        return <TreePine className="h-5 w-5" />;
      case 'garden':
        return <Flower2 className="h-5 w-5" />;
      case 'historical site':
        return <Shield className="h-5 w-5" />;
      case 'national park':
        return <Trees className="h-5 w-5" />;
      case 'temple':
      case 'religious site':
        return <Church className="h-5 w-5" />;
      case 'museum':
        return <Building2 className="h-5 w-5" />;
      case 'wildlife':
        return <Fish className="h-5 w-5" />;
      default:
        return <Camera className="h-5 w-5" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch(sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-green-600';
      case 'neutral':
        return 'text-amber-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSentimentDescription = (sentiment: string, score: number) => {
    score = Math.round(score * 100);
    switch(sentiment?.toLowerCase()) {
      case 'positive':
        return `Visitors have highly positive experiences (${score}% positive sentiment)`;
      case 'neutral':
        return `Visitors have generally good experiences (${score}% neutral sentiment)`;
      case 'negative':
        return `Some visitors have had concerns (${score}% negative sentiment)`;
      default:
        return 'Sentiment analysis not available';
    }
  };

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
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-4xl font-bold">{locationName}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>{locationDetails?.Located_City || 'Sri Lanka'}</span>
                    {locationDetails?.Location_Type && (
                      <>
                        <span className="mx-1">•</span>
                        <span className="capitalize">{locationDetails.Location_Type}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: locationName,
                          text: `Check out ${locationName} on TravelNXT!`,
                          url: window.location.href,
                        }).catch(err => console.error('Error sharing:', err));
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        toast({
                          title: "Link copied",
                          description: "The location URL has been copied to your clipboard",
                        });
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    variant={isBookmarked ? "default" : "outline"}
                    size="sm"
                    onClick={handleBookmarkToggle}
                    disabled={bookmarkLoading}
                    className="flex items-center gap-2"
                  >
                    {bookmarkLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isBookmarked ? (
                      <BookmarkCheck className="h-4 w-4" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                    {isBookmarked ? "Saved" : "Save"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  {/* Main location image/placeholder */}
                  <div className="bg-accent rounded-lg h-64 flex items-center justify-center mb-6 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-primary/20 to-transparent">
                      <div className="text-4xl opacity-30">
                        {getLocationIcon(locationDetails?.Location_Type || '')}
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-md px-3 py-1.5 flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">
                        {locationDetails?.Rating.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Location description */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">About {locationName}</h2>
                    <p className="text-muted-foreground">
                      {locationName} is a {locationDetails?.Location_Type.toLowerCase() || 'popular destination'} located in {locationDetails?.Located_City || 'Sri Lanka'}. 
                      It&apos;s known for its natural beauty and cultural significance.
                    </p>
                    
                    <div className="pt-4">
                      <h3 className="font-semibold mb-2">Visitor Sentiment</h3>
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-2 ${getSentimentColor(locationDetails?.Sentiment || '')}`}>
                          <Star className="h-5 w-5 fill-current" />
                        </div>
                        <div>
                          <p className="font-medium">{locationDetails?.Sentiment || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">
                            {getSentimentDescription(
                              locationDetails?.Sentiment || '', 
                              locationDetails?.Sentiment_Score || 0
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  {/* Rating and other details */}
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Location Details</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type</span>
                          <span className="font-medium capitalize">{locationDetails?.Location_Type || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">City</span>
                          <span className="font-medium">{locationDetails?.Located_City || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">{locationDetails?.Rating.toFixed(1) || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Weather Widget Placeholder */}
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Weather</h3>
                      <p className="text-muted-foreground">Weather information is not available at this moment.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Similar Locations */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Similar Places</h2>
                {similarLocations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {similarLocations.map((location, index) => (
                      <Card 
                        key={index} 
                        className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                        onClick={() => router.push(`/locations/${encodeURIComponent(location.Location_Name)}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            {getLocationIcon(location.Location_Type)}
                            <div className="flex-grow">
                              <h3 className="font-medium">{location.Location_Name}</h3>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{location.Located_City || 'Sri Lanka'}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-medium">{location.Rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No similar locations found.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
