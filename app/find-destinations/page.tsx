"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { CountryInput } from "../../features/find-destinations/components/CountryInput";
import { useCountrySuggestions } from "../../features/find-destinations/hooks/useCountrySuggestions";
import { getRecommendations } from "../../features/find-destinations/actions/getRecommendations";
import { Recommendation } from "../../features/find-destinations/types";
import { RecommendationList } from "../../features/find-destinations/components/RecommendationList";
import { ProfileReminder } from "../../features/find-destinations/components/ProfileReminder";

export default function FindDestinationsPage() {
  const { user, isLoaded } = useUser();
  const [country, setCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const userProfile = {
    interests: [],
    previousDestinations: [],
  };

  const { countrySuggestions, showSuggestions, setShowSuggestions } =
    useCountrySuggestions(country);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const recs = await getRecommendations();
    setRecommendations(recs);
    setIsLoading(false);
    setShowRecommendations(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex-1 pb-12">
        <div className="bg-white py-12">
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
                  </div>
                </form>
              </CardContent>
            </Card>
            {/* Show search results above the profile reminder */}
            {showRecommendations && (
              <RecommendationList recommendations={recommendations} />
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
