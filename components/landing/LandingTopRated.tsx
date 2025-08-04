import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@clerk/nextjs";
import { 
  MapPin, 
  Star, 
  Waves, 
  Mountain, 
  Landmark, 
  TreePine, 
  Flower2, 
  Shield, 
  Trees, 
  Church, 
  Building2, 
  Fish, 
  Camera 
} from "lucide-react";

interface TopRatedLocation {
  Location_Name: string;
  Located_City: string;
  Location_Type: string;
  Rating: number;
  Sentiment: string;
  Sentiment_Score: number;
  final_score: number;
}

export function LandingTopRated() {
  const { isSignedIn } = useAuth();
  const [locations, setLocations] = useState<TopRatedLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only fetch data if user is signed in
    if (!isSignedIn) {
      setIsLoading(false);
      return;
    }

    const fetchTopRated = async (retryCount = 0, maxRetries = 3) => {
      try {
        setIsLoading(true);
        // Use the authenticated API endpoint
        const response = await fetch('/api/top-rated');
        
        if (!response.ok) {
          if (retryCount < maxRetries) {
            console.log(`Retry attempt ${retryCount + 1} of ${maxRetries}`);
            setTimeout(() => fetchTopRated(retryCount + 1, maxRetries), 1000 * (retryCount + 1));
            return;
          }
          throw new Error('Failed to fetch top-rated locations');
        }

        const data = await response.json();
        
        if (data.error) {
          if (retryCount < maxRetries) {
            console.log(`Retry attempt ${retryCount + 1} of ${maxRetries}`);
            setTimeout(() => fetchTopRated(retryCount + 1, maxRetries), 1000 * (retryCount + 1));
            return;
          }
          throw new Error(data.error);
        }
        
        // Data is already limited to 6 by the API
        setLocations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching top-rated locations:', error);
        // Just set empty locations and hide the section if there's an error
        setLocations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopRated();
  }, [isSignedIn]);

  // Function to get icon based on location type
  const getLocationIcon = (locationType: string) => {
    const iconClass = "h-4 w-4";
    switch (locationType.toLowerCase()) {
      case "beaches":
        return <Waves className={iconClass} />;
      case "bodies of water":
        return <Fish className={iconClass} />;
      case "farms":
        return <TreePine className={iconClass} />;
      case "gardens":
        return <Flower2 className={iconClass} />;
      case "historic sites":
        return <Landmark className={iconClass} />;
      case "museums":
        return <Building2 className={iconClass} />;
      case "national parks":
        return <Shield className={iconClass} />;
      case "nature & wildlife areas":
        return <Trees className={iconClass} />;
      case "waterfalls":
        return <Mountain className={iconClass} />;
      case "zoological gardens":
        return <Camera className={iconClass} />;
      case "religious sites":
        return <Church className={iconClass} />;
      default:
        return <MapPin className={iconClass} />;
    }
  };

  // Don't show anything if user is not signed in
  if (!isSignedIn) {
    return null;
  }

  // Don't show anything if there's an error or no data
  if (locations.length === 0 && !isLoading) {
    return null;
  }

  return (
    <section className="py-16 bg-background">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Top-Rated Destinations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the highest-rated travel destinations with exceptional visitor experiences
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:bg-accent/50"
              >
                <CardContent className="p-6">
                  {/* Header with location name and ratings */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl leading-tight mb-2 text-foreground">
                        {location.Location_Name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        {getLocationIcon(location.Location_Type)}
                        <span className="text-base font-medium text-muted-foreground">
                          {location.Located_City}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {/* Rating */}
                      <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">
                          {location.Rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Location type */}
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="inline-block bg-secondary/50 text-secondary-foreground text-sm font-medium px-3 py-1 rounded-full capitalize">
                      {location.Location_Type}
                    </span>
                  </div>
                  
                  {/* Positive rating percentage - simplified for landing page */}
                  <div className="mb-4">
                    <div className={`inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-md ${
                      location.Sentiment === "Positive" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                    }`}>
                      <Star className="h-4 w-4 fill-current" />
                      <span>{(location.Sentiment_Score * 100).toFixed(0)}% positive feedback</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
