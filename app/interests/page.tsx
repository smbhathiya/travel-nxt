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
  UtensilsCrossed,
  Palette,
  Camera,
  Tent,
  Trees,
  Users,
  Building2,
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
    { id: "beach", name: "Beaches", icon: <Waves className="h-6 w-6" /> },
    {
      id: "mountains",
      name: "Mountains",
      icon: <Mountain className="h-6 w-6" />,
    },
    {
      id: "culture",
      name: "Cultural Sites",
      icon: <Landmark className="h-6 w-6" />,
    },
    {
      id: "food",
      name: "Culinary",
      icon: <UtensilsCrossed className="h-6 w-6" />,
    },
    {
      id: "arts",
      name: "Arts & Museums",
      icon: <Palette className="h-6 w-6" />,
    },
    {
      id: "photography",
      name: "Photography",
      icon: <Camera className="h-6 w-6" />,
    },
    { id: "camping", name: "Camping", icon: <Tent className="h-6 w-6" /> },
    { id: "nature", name: "Nature", icon: <Trees className="h-6 w-6" /> },
    {
      id: "festivals",
      name: "Festivals & Events",
      icon: <Users className="h-6 w-6" />,
    },
    {
      id: "citylife",
      name: "Urban Adventures",
      icon: <Building2 className="h-6 w-6" />,
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
    setIsLoading(true);
    try {
      // In a real app, this would save interests to a database keyed by Clerk user ID
      console.log(`Saving interests for user ${user?.id}:`, selectedInterests);

      // For now we are just simulating the save and navigating to next screen
      router.push("/previous-trips");
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
              Select all that apply. These will help us recommend destinations
              you'll love.
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
