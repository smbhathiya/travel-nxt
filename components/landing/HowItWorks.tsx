import { Heart, MapPin, Zap } from "lucide-react";

export function HowItWorks() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-20 sm:py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl mb-4">
          How It Works
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Your journey to discovering Sri Lanka&apotss best destinations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 dark:bg-primary/20  p-6 w-20 h-20 mb-6 flex items-center justify-center">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold text-xl mb-4">Share Your Interests</h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            Tell us what you love - beaches, mountains, cultural sites, national
            parks, and more
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 dark:bg-primary/20 p-6 w-20 h-20 mb-6 flex items-center justify-center">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold text-xl mb-4">AI Magic</h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            Our AI analyzes your preferences and matches you with perfect
            destinations in Sri Lanka
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 dark:bg-primary/20  p-6 w-20 h-20 mb-6 flex items-center justify-center">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold text-xl mb-4">Discover & Explore</h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            Get personalized recommendations with ratings and discover your next
            adventure in Sri Lanka
          </p>
        </div>
      </div>
    </div>
  );
}
