"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  Waves,
  Mountain,
  Landmark,
  TreePine,
  Flower2,
  Camera,
  Shield,
  Trees,
  Church,
  Building2,
  Fish,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

type Interest = {
  id: string;
  name: string;
  icon: React.ReactNode;
};

export default function InterestsPage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [hasExistingInterests, setHasExistingInterests] = useState(false);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const interests: Interest[] = [
    { id: "beaches", name: "Beaches", icon: <Waves className="h-6 w-6" /> },
    {
      id: "bodies of water",
      name: "Bodies of Water",
      icon: <Fish className="h-6 w-6" />,
    },
    {
      id: "farms",
      name: "Farms",
      icon: <TreePine className="h-6 w-6" />,
    },
    {
      id: "gardens",
      name: "Gardens",
      icon: <Flower2 className="h-6 w-6" />,
    },
    {
      id: "historic sites",
      name: "Historic Sites",
      icon: <Landmark className="h-6 w-6" />,
    },
    {
      id: "museums",
      name: "Museums",
      icon: <Building2 className="h-6 w-6" />,
    },
    {
      id: "national parks",
      name: "National Parks",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      id: "nature & wildlife areas",
      name: "Nature & Wildlife Areas",
      icon: <Trees className="h-6 w-6" />,
    },
    {
      id: "waterfalls",
      name: "Waterfalls",
      icon: <Mountain className="h-6 w-6" />,
    },
    {
      id: "zoological gardens",
      name: "Zoological Gardens",
      icon: <Camera className="h-6 w-6" />,
    },
    {
      id: "religious sites",
      name: "Religious Sites",
      icon: <Church className="h-6 w-6" />,
    },
  ];

  // Fetch existing interests when component mounts
  useEffect(() => {
    const fetchExistingInterests = async () => {
      if (!user?.id) return;

      setIsFetching(true);
      try {
        const response = await fetch("/api/user/interests");
        if (response.ok) {
          const data = await response.json();
          if (data.interests && data.interests.length > 0) {
            setSelectedInterests(data.interests);
            setHasExistingInterests(true);
          }
        }
      } catch (error) {
        console.error("Error fetching existing interests:", error);
      } finally {
        setIsFetching(false);
      }
    };

    if (isLoaded && user) {
      fetchExistingInterests();
    }
  }, [user, isLoaded]);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id)
        ? prev.filter((interest) => interest !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/interests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkUserId: user.id,
          interests: selectedInterests,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save interests");
      }

      // Navigate to find destinations page
      router.push("/discover");
    } catch (error) {
      console.error("Error updating interests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1">
        <div className="container max-w-4xl mx-auto px-4 py-12">
          {isFetching ? (
            <>
              {/* Skeleton for header */}
              <div className="text-center mb-8">
                <Skeleton className="h-9 w-96 mx-auto mb-2" />
                <Skeleton className="h-5 w-full max-w-2xl mx-auto mb-2" />
                <Skeleton className="h-5 w-3/4 max-w-xl mx-auto" />
              </div>

              {/* Skeleton for interest cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
                {Array.from({ length: 11 }).map((_, index) => (
                  <Card key={index} className="p-4 flex flex-col items-center justify-center aspect-square">
                    <Skeleton className="h-6 w-6 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </Card>
                ))}
              </div>

              {/* Skeleton for buttons */}
              <div className="flex justify-center gap-4">
                <Skeleton className="h-11 w-full max-w-xs" />
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  {hasExistingInterests
                    ? "Update your travel interests"
                    : "What are your travel interests?"}
                </h1>
                <p className="text-muted-foreground">
                  {hasExistingInterests
                    ? "Modify your selections to get better recommendations for destinations in Sri Lanka."
                    : "Select all that apply. We'll recommend amazing destinations in Sri Lanka based on your interests."}
                </p>
                {hasExistingInterests && (
                  <p className="text-sm text-primary mt-2">
                    You currently have {selectedInterests.length} interest
                    {selectedInterests.length !== 1 ? "s" : ""} selected
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {interests.map((interest) => (
                  <Card
                    key={interest.id}
                    className={`cursor-pointer transition-colors p-4 flex flex-col items-center justify-center aspect-square ${
                      selectedInterests.includes(interest.id)
                        ? "bg-primary/10 dark:bg-primary/20 border-primary"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => toggleInterest(interest.id)}
                  >
                    <div
                      className={`mb-2 ${
                        selectedInterests.includes(interest.id)
                          ? "text-primary"
                          : ""
                      }`}
                    >
                      {interest.icon}
                    </div>
                    <span className="text-sm font-medium text-center">
                      {interest.name}
                    </span>
                  </Card>
                ))}
              </div>

              <div className="mt-8 flex justify-center gap-4">
                {hasExistingInterests && (
                  <Button
                    variant="outline"
                    onClick={() => router.push("/discover")}
                    className="w-full max-w-xs"
                    size="lg"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || selectedInterests.length === 0}
                  className="w-full max-w-xs"
                  size="lg"
                >
                  {isLoading
                    ? "Saving..."
                    : hasExistingInterests
                    ? "Update Interests"
                    : "Continue"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
