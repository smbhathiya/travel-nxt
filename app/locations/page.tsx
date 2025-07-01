"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Search
} from "lucide-react";
import { Navbar } from "../../components/landing/Navbar";
import { Footer } from "../../components/landing/Footer";
import { locationCategories, searchLocations } from "../../lib/location-data";
import { CategoryGrid } from "@/components/locations/CategoryGrid";
import { useRouter, useSearchParams } from "next/navigation";

export default function LocationSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if there's a category in URL params
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);
  
  useEffect(() => {
    if (searchQuery.length > 0) {
      const results = searchLocations(searchQuery);
      setFilteredLocations(results);
      setShowDropdown(true);
    } else {
      setFilteredLocations([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  const handleLocationSelect = (location: string) => {
    setSearchQuery(location);
    setShowDropdown(false);
    router.push(`/locations/${encodeURIComponent(location)}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      router.push(`/locations/${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Explore Destinations</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Search for destinations in Sri Lanka and discover details, ratings, and similar places
            </p>
          </div>

          <div className="max-w-2xl mx-auto relative">
            <form onSubmit={handleSearch} className="flex gap-2 mb-8">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search for a destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setSearchQuery("")}
                  >
                    &times;
                  </Button>
                )}
              </div>
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>

            {showDropdown && filteredLocations.length > 0 && (
              <div className="absolute z-10 w-full bg-background shadow-lg rounded-lg border border-border mt-1 max-h-80 overflow-y-auto">
                <ul>
                  {filteredLocations.map((location, index) => (
                    <li
                      key={index}
                      className="px-4 py-3 hover:bg-accent cursor-pointer flex items-center gap-2 border-b border-border last:border-b-0"
                      onClick={() => handleLocationSelect(location)}
                    >
                      <MapPin className="h-4 w-4" />
                      <span>{location}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {selectedCategory ? (
            <div className="mt-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{selectedCategory} Destinations</h2>
                <Button variant="outline" onClick={() => router.push('/locations')}>
                  View All Categories
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {locationCategories
                  .find(category => category.type === selectedCategory)?.locations
                  .map((location, index) => (
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


