"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      const response = await fetch('/api/user/interests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkUserId: user.id,
          interests: selectedInterests,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save interests');
      }

      // Navigate to find destinations page
      router.push("/find-destinations");
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              What are your travel interests?
            </h1>
            <p className="text-muted-foreground">
              Select all that apply. We'll recommend amazing destinations in Sri Lanka based on your interests.
            </p>
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

          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || selectedInterests.length === 0}
              className="w-full max-w-xs"
              size="lg"
            >
              {isLoading ? "Saving..." : "Continue"}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
