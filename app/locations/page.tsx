"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Navbar } from "../../components/landing/Navbar";
import { Footer } from "../../components/landing/Footer";
import { LocationSearchPopover } from "@/components/locations/LocationSearchPopover";
import { useRouter, useSearchParams } from "next/navigation";
import ErrorBoundary from "@/components/ErrorBoundary";
import CategoryGrid from "@/components/locations/CategoryGrid";

export default function LocationSearch() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryLocations, setCategoryLocations] = useState<{ id: string; name: string }[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedCategory) {
      setCategoryLoading(true);
      fetch(
        `/api/locations/by-category?category=${encodeURIComponent(
          selectedCategory
        )}`
      )
        .then((res) => res.json())
        .then((data) => setCategoryLocations(data))
        .catch(() => setCategoryLocations([]))
        .finally(() => setCategoryLoading(false));
    } else {
      setCategoryLocations([]);
    }
  }, [selectedCategory]);

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
                {categoryLoading ? (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    Loading...
                  </div>
                ) : categoryLocations.length > 0 ? (
                  categoryLocations.map((location) => (
                    <Card
                      key={location.id}
                      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => handleLocationSelect(location.name)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{location.name}</h3>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No locations found for this category.
                  </div>
                )}
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
