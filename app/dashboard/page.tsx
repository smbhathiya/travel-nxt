"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Map, Heart, History } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useUser } from "@clerk/nextjs";

type UserData = {
  interests: string[];
  previousDestinations: { place: string; visitDate: string }[];
};

export default function Dashboard() {
  const { user, isLoaded } = useUser();

  // This would typically come from your database based on the Clerk user ID
  // For now we'll use mock data
  const userData: UserData = {
    interests: ["beach", "mountains", "food"],
    previousDestinations: [
      { place: "Paris, France", visitDate: "2023-05" },
      { place: "Tokyo, Japan", visitDate: "2024-01" },
    ],
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.firstName || user?.username}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-3 mb-4">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">Find New Destinations</h3>
                    <p className="text-sm text-muted-foreground mt-2 mb-4">
                      Discover places that match your interests
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/find-destinations">Explore</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-3 mb-4">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">My Interests</h3>
                    <p className="text-sm text-muted-foreground mt-2 mb-4">
                      {userData.interests && userData.interests.length > 0
                        ? `You have selected ${userData.interests.length} interests`
                        : "Add your travel interests"}
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/interests">
                        {userData.interests && userData.interests.length > 0
                          ? "Update"
                          : "Add"}{" "}
                        Interests
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-3 mb-4">
                      <History className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">My Travel History</h3>
                    <p className="text-sm text-muted-foreground mt-2 mb-4">
                      {userData.previousDestinations &&
                      userData.previousDestinations.length > 0
                        ? `You have visited ${userData.previousDestinations.length} destinations`
                        : "Add places you've already visited"}
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/previous-trips">
                        {userData.previousDestinations &&
                        userData.previousDestinations.length > 0
                          ? "Update"
                          : "Add"}{" "}
                        History
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {(userData.interests?.length === 0 ||
              userData.previousDestinations?.length === 0) && (
              <div className="rounded-lg bg-muted p-6 mt-6">
                <h3 className="font-medium text-lg mb-2">
                  Complete Your Profile
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Add your travel interests and history to get personalized
                  recommendations
                </p>
                <div className="flex flex-wrap gap-3">
                  {userData.interests?.length === 0 && (
                    <Button asChild size="sm" variant="secondary">
                      <Link href="/interests">Add Interests</Link>
                    </Button>
                  )}
                  {userData.previousDestinations?.length === 0 && (
                    <Button asChild size="sm" variant="secondary">
                      <Link href="/previous-trips">Add Travel History</Link>
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Recommended For You</h2>
              {userData.interests?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="overflow-hidden">
                    <div className="h-48 bg-muted flex items-center justify-center">
                      <Map className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">
                        Find personalized recommendations
                      </h3>
                      <Button asChild className="w-full mt-4" size="sm">
                        <Link href="/find-destinations">Get Started</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Add your interests to see personalized recommendations
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
