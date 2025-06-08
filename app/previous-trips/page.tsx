"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Plus, X, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useUser } from "@clerk/nextjs";

type Destination = {
  place: string;
  visitDate: string;
};

export default function PreviousTripsPage() {
  const { user, isLoaded } = useUser();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [newPlace, setNewPlace] = useState("");
  const [newVisitDate, setNewVisitDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const addDestination = () => {
    if (newPlace.trim()) {
      setDestinations([
        ...destinations,
        { place: newPlace.trim(), visitDate: newVisitDate || "Not specified" },
      ]);
      setNewPlace("");
      setNewVisitDate("");
    }
  };

  const removeDestination = (index: number) => {
    setDestinations(destinations.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      console.log(
        `Saving previous destinations for user ${user?.id}:`,
        destinations
      );

      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating previous destinations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addDestination();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1">
        <div className="container max-w-3xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Where have you traveled?
            </h1>
            <p className="text-muted-foreground">
              Add places you've visited before to help us make better
              recommendations.
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label
                    htmlFor="place"
                    className="text-sm font-medium mb-1 block"
                  >
                    Destination
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="place"
                      placeholder="City, Country"
                      className="pl-10"
                      value={newPlace}
                      onChange={(e) => setNewPlace(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-32">
                  <label
                    htmlFor="visitDate"
                    className="text-sm font-medium mb-1 block"
                  >
                    When
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="visitDate"
                      type="month"
                      className="pl-10"
                      value={newVisitDate}
                      onChange={(e) => setNewVisitDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <Button type="button" onClick={addDestination} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {destinations.length > 0 ? (
            <div className="space-y-4">
              <h2 className="font-medium">
                Your destinations ({destinations.length})
              </h2>
              <div className="space-y-2">
                {destinations.map((destination, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div>
                      <p className="font-medium">{destination.place}</p>
                      <p className="text-sm text-muted-foreground">
                        {destination.visitDate}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDestination(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-8 bg-muted rounded-lg">
              <p className="text-muted-foreground">
                No destinations added yet. Add places you've visited before.
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
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
