import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { getTopRatedLocations, type TopRatedLocation } from "@/features/find-destinations/actions";

interface TopRatedLocationsProps {
  className?: string;
}

export function TopRatedLocations({ className = "" }: TopRatedLocationsProps) {
  const [locations, setLocations] = useState<TopRatedLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        setIsLoading(true);
        const data = await getTopRatedLocations(6);
        setLocations(data);
      } catch (error) {
        console.error('Error fetching top-rated locations:', error);
        setError('Failed to load top-rated locations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopRated();
  }, []);

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

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Top Rated Destinations</h2>
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
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location, index) => (
            <Card
              key={location.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:bg-accent/50"
            >
              <CardContent className="p-6">
                {/* Header with location name and ratings */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl leading-tight mb-2 text-foreground">
                      {location.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      {getLocationIcon(location.type)}
                      <span className="text-base font-medium text-muted-foreground">
                        {location.locatedCity}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {/* Rating */}
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">
                        {location.overallRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Location type */}
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className="inline-block bg-secondary/50 text-secondary-foreground text-sm font-medium px-3 py-1 rounded-full capitalize">
                    {location.type}
                  </span>
                </div>
                
                {/* About section */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {location.about}
                  </p>
                </div>

                {/* Feedback count */}
                {location._count && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>{location._count.feedbacks} reviews</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
