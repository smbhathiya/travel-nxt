"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ArrowLeft, Bookmark, BookmarkCheck, Heart, Share2, ExternalLink, Mountain, Waves, Landmark, TreePine, Flower2, Shield, Trees, Church, Building2, Fish, Camera } from "lucide-react";
import { Navbar } from "../../../components/landing/Navbar";
import { Footer } from "../../../components/landing/Footer";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { FeedbackSection } from "./FeedbackSection";
import { motion } from "framer-motion";

interface LocationData {
  id: string;
  name: string;
  type: string;
  locatedCity: string;
  about: string;
  overallRating: number;
  unsplashImage: string;
  feedbacks: unknown[];
}

export default function LocationDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [locationDetails, setLocationDetails] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut" as const,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  const getLocationIcon = (locationType: string) => {
    const iconClass = "h-6 w-6";
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

  // Bookmark handler
  const handleBookmark = async () => {
    if (!isSignedIn) {
      toast({ title: 'Sign in required', description: 'Please sign in to bookmark locations.' });
      return;
    }
    setBookmarkLoading(true);
    try {
      const res = await fetch(`/api/bookmarks`, {
        method: isBookmarked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationId: id }),
      });
      if (!res.ok) throw new Error('Failed to update bookmark');
      setIsBookmarked(!isBookmarked);
      toast({ title: isBookmarked ? 'Bookmark removed' : 'Bookmarked!', description: locationDetails?.name });
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Bookmark action failed' });
    } finally {
      setBookmarkLoading(false);
    }
  };

  useEffect(() => {
    const fetchLocationData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const detailsResponse = await fetch(`/api/location-details/${id}`);
        if (!detailsResponse.ok) {
          throw new Error('Failed to fetch location details');
        }
        const detailsData = await detailsResponse.json();
        if (detailsData && !detailsData.error) {
          setLocationDetails(detailsData);
        } else if (detailsData.error) {
          throw new Error(detailsData.error);
        } else {
          throw new Error('No details found for this location');
        }
        // Fetch bookmark status if signed in
        if (isSignedIn) {
          const bookmarkRes = await fetch(`/api/bookmarks?locationId=${id}`);
          if (bookmarkRes.ok) {
            const bookmarkData = await bookmarkRes.json();
            setIsBookmarked(!!bookmarkData?.bookmarked);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching data';
        setError(errorMessage);
        console.error('Error fetching location data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocationData();
  }, [id, isSignedIn]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <div className="flex-1 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div
            className="absolute top-40 right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: "2s" }}
          />
          <motion.div
            className="absolute bottom-40 left-20 w-24 h-24 bg-primary/5 rounded-full blur-3xl"
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: "4s" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <motion.div 
          className="container max-w-7xl mx-auto px-4 py-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back Button */}
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="border-border hover:border-border/60 rounded-full px-6 py-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go back
              </Button>
            </motion.div>
          </motion.div>

          {isLoading ? (
            <motion.div 
              className="space-y-8"
              variants={containerVariants}
            >
              <motion.div className="space-y-4" variants={itemVariants}>
                <Skeleton className="h-12 w-3/4 bg-card" />
                <Skeleton className="h-6 w-1/3 bg-card" />
              </motion.div>
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" variants={itemVariants}>
                <div className="space-y-4">
                  <Skeleton className="h-64 rounded-2xl bg-card" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-card" />
                    <Skeleton className="h-4 w-5/6 bg-card" />
                    <Skeleton className="h-4 w-4/6 bg-card" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-24 rounded-2xl bg-card" />
                  <Skeleton className="h-24 rounded-2xl bg-card" />
                  <Skeleton className="h-24 rounded-2xl bg-card" />
                </div>
              </motion.div>
            </motion.div>
          ) : error ? (
            <motion.div 
              className="p-8 text-center bg-card border border-border rounded-2xl"
              variants={itemVariants}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-3xl mb-4"
                whileHover={{ scale: 1.1 }}
              >
                <Heart className="h-8 w-8 text-red-500" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Error</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => router.push('/locations')}
                  className="bg-primary hover:bg-primary/90 rounded-full px-6 py-2"
                >
                  Return to Location Search
                </Button>
              </motion.div>
            </motion.div>
          ) : locationDetails ? (
            <motion.div 
              className="space-y-12"
              variants={containerVariants}
            >
              {/* Header Section */}
              <motion.div 
                className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                variants={itemVariants}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-2xl"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {getLocationIcon(locationDetails.type)}
                    </motion.div>
                    <div>
                      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-2">
                        {locationDetails.name}
                      </h1>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{locationDetails.locatedCity || 'Sri Lanka'}</span>
                        {locationDetails.type && (
                          <>
                            <span className="mx-1">•</span>
                            <span className="capitalize">{locationDetails.type}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleBookmark}
                      disabled={bookmarkLoading}
                      variant={isBookmarked ? 'default' : 'outline'}
                      className={`rounded-full px-6 py-2 ${
                        isBookmarked 
                          ? 'bg-primary hover:bg-primary/90' 
                          : 'border-border hover:border-border/60'
                      }`}
                      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                    >
                      {bookmarkLoading ? (
                        'Loading...'
                      ) : isBookmarked ? (
                        <>
                          <BookmarkCheck className="h-5 w-5 mr-2" /> Bookmarked
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-5 w-5 mr-2" /> Bookmark
                        </>
                      )}
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="rounded-full px-4 py-2 border-border hover:border-border/60"
                      onClick={() => {
                        const searchQuery = `${locationDetails.name} ${locationDetails.locatedCity} Sri Lanka tourist attractions`;
                        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
                        window.open(googleSearchUrl, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <ExternalLink className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Main Content */}
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                variants={itemVariants}
              >
                {/* Left Column - Image and About */}
                <motion.div 
                  className="lg:col-span-2 space-y-8"
                  variants={cardVariants}
                >
                  {/* Main location image */}
                  <motion.div 
                    className="relative h-80 md:h-96 rounded-3xl overflow-hidden bg-card border border-border"
                    whileHover={{ scale: 1.02 }}
                  >
                    {locationDetails.unsplashImage ? (
                      <Image 
                        src={locationDetails.unsplashImage} 
                        alt={locationDetails.name} 
                        fill 
                        className="object-cover w-full h-full" 
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <motion.div
                          className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-3xl"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {getLocationIcon(locationDetails.type)}
                        </motion.div>
                      </div>
                    )}
                    
                    {/* Rating Badge */}
                    <motion.div 
                      className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-white">
                          {locationDetails.overallRating?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* About Section */}
                  <motion.div 
                    className="bg-card backdrop-blur-xl rounded-3xl p-8 border border-border"
                    variants={cardVariants}
                  >
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                      About {locationDetails.name}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {locationDetails.about}
                    </p>
                  </motion.div>
                </motion.div>

                {/* Right Column - Details Card */}
                <motion.div 
                  className="lg:col-span-1"
                  variants={cardVariants}
                >
                  <Card className="bg-card backdrop-blur-xl border border-border rounded-3xl overflow-hidden sticky top-8">
                    <CardContent className="p-8">
                      <h3 className="text-xl font-bold text-foreground mb-6">
                        Location Details
                      </h3>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl">
                          <span className="text-muted-foreground font-medium">Type</span>
                          <span className="font-bold text-foreground capitalize">
                            {locationDetails.type || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl">
                          <span className="text-muted-foreground font-medium">City</span>
                          <span className="font-bold text-foreground">
                            {locationDetails.locatedCity || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl">
                          <span className="text-muted-foreground font-medium">Rating</span>
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-foreground">
                              {locationDetails.overallRating?.toFixed(1) || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Feedback Section */}
              <motion.div variants={itemVariants}>
                <FeedbackSection locationId={id} userId={user?.id} />
              </motion.div>
            </motion.div>
          ) : null}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
