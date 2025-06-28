import { Heart, MapPin, Zap } from "lucide-react";

export function HowItWorks() {
  return (
    <div className="container max-w-6xl mx-auto px-4 pb-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold sm:text-3xl">How It Works</h2>
        <p className="mt-2 text-muted-foreground">
          Your journey to discovering Sri Lanka's best destinations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 w-16 h-16 mb-4 flex items-center justify-center">
            <Heart className="h-7 w-7 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">Share Your Interests</h3>
          <p className="text-sm text-muted-foreground">
            Tell us what you love - beaches, mountains, cultural sites, national parks, and more
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 w-16 h-16 mb-4 flex items-center justify-center">
            <Zap className="h-7 w-7 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">AI Magic</h3>
          <p className="text-sm text-muted-foreground">
            Our AI analyzes your preferences and matches you with perfect destinations in Sri Lanka
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 w-16 h-16 mb-4 flex items-center justify-center">
            <MapPin className="h-7 w-7 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">Discover & Explore</h3>
          <p className="text-sm text-muted-foreground">
            Get personalized recommendations with ratings and discover your next adventure in Sri Lanka
          </p>
        </div>
      </div>
    </div>
  );
}
