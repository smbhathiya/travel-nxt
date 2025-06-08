import { Heart, History, Globe, Zap } from "lucide-react";

export function HowItWorks() {
  return (
    <div className="container max-w-6xl mx-auto px-4 pb-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold sm:text-3xl">How It Works</h2>
        <p className="mt-2 text-muted-foreground">
          Your journey to personalized travel recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 w-16 h-16 mb-4 flex items-center justify-center">
            <Heart className="h-7 w-7 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">Share Your Interests</h3>
          <p className="text-sm text-muted-foreground">
            Tell us what you love - beaches, hiking, cultural experiences, and
            more
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 w-16 h-16 mb-4 flex items-center justify-center">
            <History className="h-7 w-7 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">Previous Destinations</h3>
          <p className="text-sm text-muted-foreground">
            Log your travel history to help us understand your preferences
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 w-16 h-16 mb-4 flex items-center justify-center">
            <Globe className="h-7 w-7 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">Select Country</h3>
          <p className="text-sm text-muted-foreground">
            Choose where you'd like to explore next
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 w-16 h-16 mb-4 flex items-center justify-center">
            <Zap className="h-7 w-7 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">Get AI Recommendations</h3>
          <p className="text-sm text-muted-foreground">
            Receive personalized suggestions with weather insights
          </p>
        </div>
      </div>
    </div>
  );
}
