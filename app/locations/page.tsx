"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Navbar } from "../../components/landing/Navbar";
import { Footer } from "../../components/landing/Footer";
import { locationCategories } from "../../lib/location-data";
import { CategoryGrid } from "@/components/locations/CategoryGrid";
import { LocationSearchPopover } from "@/components/locations/LocationSearchPopover";
import { useRouter, useSearchParams } from "next/navigation";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function LocationSearch() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const handleLocationSelect = (location: string) => {
    router.push(`/locations/${encodeURIComponent(location)}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Explore Destinations</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Search for destinations in Sri Lanka and discover details,
              ratings, and similar places
            </p>
          </div>

          <div className="max-w-2xl mx-auto relative mb-8">
            <ErrorBoundary
              fallback={
                <div className="p-4 border rounded-md bg-accent">
                  <p className="text-center">
                    Sorry, the search component couldn&apos;t be loaded. Please
                    try refreshing the page.
                  </p>
                </div>
              }
            >
              <Suspense
                fallback={
                  <div className="h-12 bg-accent animate-pulse rounded-md"></div>
                }
              >
                <LocationSearchPopover className="w-full" />
              </Suspense>
            </ErrorBoundary>
          </div>

          {selectedCategory ? (
            <div className="mt-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedCategory} Destinations
                </h2>
                <Button
                  variant="outline"
                  onClick={() => router.push("/locations")}
                >
                  View All Categories
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {locationCategories
                  .find((category) => category.type === selectedCategory)
                  ?.locations.map((location, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => handleLocationSelect(location)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{location}</h3>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ) : (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Explore by Category</h2>
              <CategoryGrid />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
