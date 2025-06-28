"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Loader2 } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useUser } from "@clerk/nextjs";

interface Recommendation {
  Location_Name: string;
  Location_Type: string;
  Rating: number;
  personalized_score: number;
}

export default function FindDestinationsPage() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [hasInterests, setHasInterests] = useState(false);

  useEffect(() => {
    fetchUserInterests();
  }, [user]);

  const fetchUserInterests = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/user/interests');
      if (response.ok) {
        const data = await response.json();
        setUserInterests(data.interests);
        setHasInterests(data.interests && data.interests.length > 0);
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Discover Sri Lanka
            </h1>
            <p className="text-muted-foreground">
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
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Your interests: {userInterests.join(', ')}
                </p>
                <Button 
                  onClick={fetchRecommendations}
                  disabled={isLoading}
                  size="lg"
                  className="w-full max-w-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting Recommendations...
                    </>
                  ) : (
                    "Get Recommendations"
                  )}
                </Button>
              </div>

              {recommendations.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {recommendations.map((rec, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg leading-tight">
                            {rec.Location_Name}
                          </h3>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{rec.Rating.toFixed(1)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground capitalize">
                            {rec.Location_Type}
                          </span>
                        </div>

                        <div className="bg-primary/10 rounded-lg p-3">
                          <div className="text-sm font-medium text-primary mb-1">
                            Personalized Score
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="bg-primary/20 rounded-full h-2 flex-1 mr-3">
                              <div 
                                className="bg-primary h-full rounded-full" 
                                style={{ width: `${rec.personalized_score * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {(rec.personalized_score * 100).toFixed(0)}%
                            </span>
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
