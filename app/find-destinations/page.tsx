"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useUser } from "@clerk/nextjs";
import { CountryInput } from "../../features/find-destinations/components/CountryInput";
import { useCountrySuggestions } from "../../features/find-destinations/hooks/useCountrySuggestions";
import { getDestinationsByCountry } from "../../features/find-destinations/actions/getRecommendations";
import { Recommendation } from "../../features/find-destinations/types";
import { RecommendationList } from "../../features/find-destinations/components/RecommendationList";
import { ProfileReminder } from "../../features/find-destinations/components/ProfileReminder";

export default function FindDestinationsPage() {
  const { user } = useUser();
  const [country, setCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const userProfile = {
    interests: [],
    previousDestinations: [],
  };

  const { countrySuggestions, showSuggestions, setShowSuggestions } =
    useCountrySuggestions(country);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!country.trim()) return;

    setIsLoading(true);
    try {
      // Use the new Gemini-powered server action to get destinations by country
      const recs = await getDestinationsByCountry(country);
      setRecommendations(recs);
      setShowRecommendations(true);

      // Add to search history if it's not already there
      if (!searchHistory.includes(country)) {
        setSearchHistory((prev) => [country, ...prev].slice(0, 5)); // Keep only last 5 searches
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      // Fallback: show no recommendations if error
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-1 pb-12">
        <div className="bg-background py-12">
          <div className="container w-full mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Find Your Perfect Destination
              </h1>
              <p className="text-muted-foreground">
                Let our AI recommend destinations based on your interests and
                travel history
              </p>
            </div>
            <Card className="mb-6 max-w-3xl justify-center mx-auto">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <label
                        htmlFor="country"
                        className="text-sm font-medium mb-1 block"
                      >
                        Where would you like to go?
                      </label>
                      <CountryInput
                        country={country}
                        setCountry={setCountry}
                        showSuggestions={showSuggestions}
                        setShowSuggestions={setShowSuggestions}
                        countrySuggestions={countrySuggestions}
                      />
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
                  </div>{" "}
                </form>

                {/* Recent Searches */}
                {searchHistory.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Recent searches:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.map((item, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCountry(item);
                            // Execute search for this history item
                            (async () => {
                              setIsLoading(true);
                              try {
                                const recs = await getDestinationsByCountry(
                                  item
                                );
                                setRecommendations(recs);
                                setShowRecommendations(true);
                              } catch (error) {
                                console.error(
                                  "Error fetching recommendations:",
                                  error
                                );
                                setRecommendations([]);
                              } finally {
                                setIsLoading(false);
                              }
                            })();
                          }}
                        >
                          {item}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Show search results above the profile reminder */}
            {showRecommendations && (
              <div>
                {" "}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold">
                    {recommendations.length > 0
                      ? `Destinations in ${recommendations[0].country}`
                      : "No destinations found"}
                  </h2>
                  {recommendations.length > 0 ? (
                    <p className="text-muted-foreground mt-2">
                      We found {recommendations.length} destinations that match
                      your search
                    </p>
                  ) : (
                    <div className="mt-8 p-6 border border-muted rounded-lg shadow-sm">
                      <p className="text-muted-foreground mb-3">
                        No destinations were found for your search. Please try
                        another country or check your connection.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setShowRecommendations(false)}
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                </div>
                {recommendations.length > 0 && (
                  <RecommendationList recommendations={recommendations} />
                )}
              </div>
            )}
            <ProfileReminder
              show={
                (!userProfile.interests?.length ||
                  !userProfile.previousDestinations?.length) &&
                !!user
              }
              userProfile={userProfile}
              user={user}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
