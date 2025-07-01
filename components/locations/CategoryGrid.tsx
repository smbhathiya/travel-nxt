"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getAllCategoriesWithCounts } from "@/lib/location-data";
import Link from "next/link";
import { 
  MapPin, 
  Waves, 
  Mountain, 
  Landmark, 
  TreePine, 
  Flower2, 
  Shield, 
  Trees, 
  Church, 
  Building2, 
  Fish
} from "lucide-react";

interface CategoryGridProps {
  className?: string;
}

export function CategoryGrid({ className }: CategoryGridProps) {
  const categories = getAllCategoriesWithCounts();

  const getIconForCategory = (categoryType: string) => {
    const iconClass = "h-12 w-12";
    switch (categoryType.toLowerCase()) {
      case "beaches":
        return <Waves className={iconClass} />;
      case "lakes":
        return <Fish className={iconClass} />;
      case "farms & tea estates":
        return <TreePine className={iconClass} />;
      case "gardens":
        return <Flower2 className={iconClass} />;
      case "historic sites":
        return <Landmark className={iconClass} />;
      case "museums":
        return <Building2 className={iconClass} />;
      case "national parks":
        return <Shield className={iconClass} />;
      case "wildlife areas":
        return <Trees className={iconClass} />;
      case "waterfalls":
        return <Mountain className={iconClass} />;
      case "temples":
        return <Church className={iconClass} />;
      default:
        return <MapPin className={iconClass} />;
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {categories.map((category) => (
        <Link 
          key={category.type} 
          href={`/locations?category=${encodeURIComponent(category.type)}`}
          className="block"
        >
          <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-md bg-primary/10">
                  {getIconForCategory(category.type)}
                </div>
                <span className="text-lg font-medium bg-secondary/50 text-secondary-foreground px-3 py-1 rounded-full">
                  {category.count} locations
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{category.type}</h3>
              <p className="text-muted-foreground flex-grow">
                {category.description}
              </p>
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
        </Link>
      ))}
    </div>
  );
}
