"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function CategoryLocationsPage() {
  const router = useRouter();
  const params = useParams();
  const categoryType = decodeURIComponent(params?.type as string || "");
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryType) return;
    setLoading(true);
    fetch(`/api/locations/by-category?category=${encodeURIComponent(categoryType)}`)
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .finally(() => setLoading(false));
  }, [categoryType]);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <button className="mb-6 text-primary underline" onClick={() => router.back()}>
        ← Back to Categories
      </button>
      <h1 className="text-3xl font-bold mb-8">{categoryType} Locations</h1>
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : locations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {locations.map((location) => (
            <Card
              key={location.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
              onClick={() => router.push(`/locations/${location.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">{location.name}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">No locations found for this category.</div>
      )}
    </div>
  );
}
