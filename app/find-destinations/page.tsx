"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Loader2, Waves, Mountain, Landmark, TreePine, Flower2, Shield, Trees, Church, Building2, Fish, Camera } from "lucide-react";
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

export default function FindDestinationsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [hasInterests, setHasInterests] = useState(false);

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

  const fetchUserInterests = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/user/interests');
      if (response.ok) {
        const data = await response.json();
        setUserInterests(data.interests);
        const hasUserInterests = data.interests && data.interests.length > 0;
        setHasInterests(hasUserInterests);
      }
    } catch (error) {
      console.error('Error fetching user interests:', error);
    }
  };

  const fetchRecommendations = async () => {
    if (!hasInterests) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Discover Sri Lanka
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get personalized recommendations for amazing destinations in Sri Lanka based on your interests
            </p>
          </div>

          {!hasInterests ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  To get personalized recommendations, please set your travel interests first.
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
                    <span className="text-sm font-medium text-muted-foreground">Your interests:</span>
                    <div className="flex flex-wrap gap-1">
                      {userInterests.slice(0, 3).map((interest, idx) => (
                        <span key={idx} className="inline-block bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
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
                    onClick={() => router.push('/interests')}
                    className="text-xs h-auto py-1 px-3 border border-primary/20 hover:border-primary"
                  >
                    Edit Interests
                  </Button>
                </div>
                
                {isLoading && recommendations.length === 0 ? (
                  <div className="flex items-center justify-center gap-2 py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-muted-foreground">Getting your personalized recommendations...</span>
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
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
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
                              <span className="text-sm font-semibold">{rec.Rating.toFixed(1)}</span>
                            </div>
                            {/* Match Score - same size as rating */}
                            <div className="flex items-center gap-1 bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded-full">
                              <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-xs font-bold text-primary-foreground">%</span>
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
