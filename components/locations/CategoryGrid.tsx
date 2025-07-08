"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function CategoryGrid() {
  const [categories, setCategories] = useState<{ type: string; _count: { id: number } }[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/locations/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading categories...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Card
          key={category.type}
          className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
          onClick={() => router.push(`/locations/category/${encodeURIComponent(category.type)}`)}
        >
          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-md bg-primary/10">
                <MapPin className="h-12 w-12" />
              </div>
              <span className="text-lg font-medium bg-secondary/50 text-secondary-foreground px-3 py-1 rounded-full">
                {category._count.id} locations
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">{category.type}</h3>
            {/* Optionally add a description here if you want */}
            <div className="flex justify-end mt-4">
              <span className="text-primary flex items-center font-medium">
                View locations
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1 h-4 w-4"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
