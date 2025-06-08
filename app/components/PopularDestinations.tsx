"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

type Destination = {
  id: number;
  name: string;
  image: string;
  rating: number;
  category: string;
};

export function PopularDestinations() {
  const { isSignedIn } = useAuth();

  const featuredDestinations: Destination[] = [
    {
      id: 1,
      name: "Bali, Indonesia",
      image: "/landing/landing-01.jpg",
      rating: 4.8,
      category: "Beach",
    },
    {
      id: 2,
      name: "Kyoto, Japan",
      image: "/landing/landing-01.jpg",
      rating: 4.9,
      category: "Cultural",
    },
    {
      id: 3,
      name: "Santorini, Greece",
      image: "/landing/landing-01.jpg",
      rating: 4.7,
      category: "Island",
    },
    {
      id: 4,
      name: "Swiss Alps",
      image: "/landing/landing-01.jpg",
      rating: 4.9,
      category: "Mountains",
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden w-full">
      <div className="absolute -left-40 top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="container max-w-6xl mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Popular <span className="text-primary">Destinations</span>
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              {isSignedIn
                ? "Discover trending locations that match your travel interests"
                : "Explore trending locations that match various travel interests"}
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-4 md:mt-0 rounded-full"
            asChild
          >
            <Link href={isSignedIn ? "/destinations" : "/sign-up"}>
              {isSignedIn ? "View All Destinations" : "Find Your Match"}
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredDestinations.map((destination) => (
            <Card
              key={destination.id}
              className="overflow-hidden group border-none mx-auto w-full max-w-sm sm:max-w-none"
            >
              <div className="relative h-56 overflow-hidden rounded-t-lg">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 rounded-full px-2 py-1 text-xs font-medium flex items-center shadow-sm">
                  <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                  <span>{destination.rating}</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-primary/80 text-primary-foreground rounded-full px-3 py-1 text-xs font-medium">
                  {destination.category}
                </div>
              </div>
              <CardContent className="p-4 bg-card rounded-b-lg shadow-sm">
                <h3 className="font-medium text-lg">{destination.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>5-7 days</span>
                  </div>
                  <Link
                    href={
                      isSignedIn ? `/destination/${destination.id}` : "/sign-up"
                    }
                    className="text-primary hover:underline text-sm flex items-center"
                  >
                    Explore <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
