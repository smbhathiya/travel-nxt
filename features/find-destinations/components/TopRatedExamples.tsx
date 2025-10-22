'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin } from 'lucide-react';
import { 
  getTopRatedLocations, 
  getTopRatedLocationsByCategory,
  getTopRatedLocationsWithMinFeedback,
  getTopRatedLocationsByCity,
  type TopRatedLocation 
} from '../actions';

export function TopRatedExamples() {
  const [locations, setLocations] = useState<TopRatedLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopRated = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTopRatedLocations(6);
      setLocations(data);
    } catch (err) {
      setError('Failed to fetch top-rated locations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchByCategory = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTopRatedLocationsByCategory(category, 6);
      setLocations(data);
    } catch (err) {
      setError(`Failed to fetch ${category} locations`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithMinFeedback = async (minFeedback: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTopRatedLocationsWithMinFeedback(minFeedback, 6);
      setLocations(data);
    } catch (err) {
      setError('Failed to fetch locations with minimum feedback');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchByCity = async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTopRatedLocationsByCity(city, 6);
      setLocations(data);
    } catch (err) {
      setError(`Failed to fetch locations in ${city}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Top Rated Locations - Server Actions Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={fetchTopRated} 
              disabled={loading}
              variant="outline"
            >
              Get All Top Rated
            </Button>
            <Button 
              onClick={() => fetchByCategory('beaches')} 
              disabled={loading}
              variant="outline"
            >
              Top Beaches
            </Button>
            <Button 
              onClick={() => fetchByCategory('museums')} 
              disabled={loading}
              variant="outline"
            >
              Top Museums
            </Button>
            <Button 
              onClick={() => fetchWithMinFeedback(5)} 
              disabled={loading}
              variant="outline"
            >
              With 5+ Reviews
            </Button>
            <Button 
              onClick={() => fetchByCity('New York')} 
              disabled={loading}
              variant="outline"
            >
              In New York
            </Button>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {loading && (
            <div className="text-center py-4">Loading...</div>
          )}

          {!loading && locations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((location) => (
                <Card key={location.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{location.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {location.overallRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {location.locatedCity}
                      </span>
                    </div>

                    <Badge variant="secondary" className="mb-2">
                      {location.type}
                    </Badge>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {location.about}
                    </p>

                    {location._count && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {location._count.feedbacks} reviews
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && locations.length === 0 && !error && (
            <div className="text-center py-8 text-muted-foreground">
              No locations found. Try a different filter.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 