import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Recommendation } from "../../find-destinations/types";

export function RecommendationList({
  recommendations,
}: {
  recommendations: Recommendation[];
}) {
  return (
    <div className="container max-w-6xl mx-auto px-4 mt-12">
      <h2 className="text-2xl font-bold mb-6">
        Recommended Destinations for You
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {recommendations.map((recommendation) => (
          <Card
            key={recommendation.id}
            className="overflow-hidden flex flex-col h-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 h-full">
              <div className="relative h-64 md:h-auto md:col-span-1">
                <Image
                  src={recommendation.image}
                  alt={recommendation.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full px-2 py-1 text-sm font-medium flex items-center gap-1">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>{recommendation.matchScore}% Match</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/70 text-white rounded-full px-3 py-1 text-xs font-medium">
                  {recommendation.category}
                </div>
              </div>
              <div className="p-6 col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">
                        {recommendation.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {recommendation.country}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 font-medium">
                        {4 + Math.random().toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4">{recommendation.description}</p>
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Weather Forecast</h4>
                    <div className="flex flex-wrap gap-4">
                      {recommendation.weatherForecasts.map((forecast, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center bg-muted p-3 rounded-md text-center min-w-[90px]"
                        >
                          <span className="text-xs font-medium text-muted-foreground">
                            {forecast.month}
                          </span>
                          <div className="my-1">
                            {forecast.icon && (
                              <forecast.icon className="text-primary" />
                            )}
                          </div>
                          <span className="font-medium">
                            {forecast.averageTemp}°C
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {forecast.conditions}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href={`/destination/${recommendation.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button variant="outline">Save</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
