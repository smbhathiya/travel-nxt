import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Recommendation } from "../../find-destinations/types";

export function RecommendationList({
  recommendations,
}: {
  recommendations: Recommendation[];
}) {
  return (
    <div className="container w-full mx-auto px-4 mt-12">
      <h2 className="text-2xl font-bold mb-10 text-center">
        Recommended Destinations for You
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {recommendations.map((recommendation) => (
          <Card
            key={recommendation.id}
            className="overflow-hidden border-0 rounded-lg shadow-md"
          >
            {/* Card Image with Top Match Badge */}
            <div className="relative">
              {/* Match Badge */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                <span>{recommendation.matchScore}%</span>
              </div>

              {/* Category Badge */}
              <div className="absolute top-3 right-3 z-10 bg-white/90 text-xs font-semibold px-3 py-1 rounded-full">
                {recommendation.category}
              </div>

              {/* Image */}
              <div className="relative w-full h-52">
                <Image
                  src={recommendation.image}
                  alt={recommendation.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5">
              {/* Destination Name and Rating */}
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-xl font-bold">{recommendation.name}</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="text-sm font-medium">
                    {(4.5 + ((recommendation.id * 0.1) % 0.5)).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Country */}
              <p className="text-muted-foreground text-sm mb-3">
                {recommendation.country}
              </p>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {recommendation.description}
              </p>

              {/* Weather Forecast */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Weather Forecast</h4>
                <div className="grid grid-cols-3 gap-2">
                  {recommendation.weatherForecasts
                    .slice(0, 3)
                    .map((forecast, idx) => (
                      <div
                        key={idx}
                        className="bg-muted p-2 rounded-md text-center"
                      >
                        <p className="text-xs text-muted-foreground">
                          {forecast.month}
                        </p>
                        <div className="my-1">
                          {forecast.icon && (
                            <forecast.icon className="h-4 w-4 mx-auto text-primary" />
                          )}
                        </div>
                        <p className="text-sm font-medium">
                          {forecast.averageTemp}°C
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button asChild size="sm" className="flex-1">
                  <Link href={`/destination/${recommendation.id}`}>
                    View Details
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Save
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
