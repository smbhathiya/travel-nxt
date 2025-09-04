"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Star,
  Loader2,
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
  Camera,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Brain,
  Sparkles,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Navbar } from "../../components/landing/Navbar";
import { Footer } from "../../components/landing/Footer";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  getPersonalizedRecommendations, 
  type PersonalizedRecommendation,
  type PredictedInterest 
} from "@/features/find-destinations/actions";
import Image from "next/image";

export default function FindDestinationsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [predictedInterests, setPredictedInterests] = useState<PredictedInterest[]>([]);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [hasInterests, setHasInterests] = useState(false);
  const [bookmarkedLocations, setBookmarkedLocations] = useState<Set<string>>(
    new Set()
  );
  const [bookmarkLoading, setBookmarkLoading] = useState<Set<string>>(
    new Set()
  );
  const [interestsLoading, setInterestsLoading] = useState(true);
  const [recommendationsFetched, setRecommendationsFetched] = useState(false);
  const [usingPredictedInterests, setUsingPredictedInterests] = useState(false);

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

  const fetchUserInterests = useCallback(async () => {
    if (!user) return;

    setInterestsLoading(true);
    try {
      const response = await fetch("/api/user/interests");
      if (response.ok) {
        const data = await response.json();
        setUserInterests(data.interests);
        const hasUserInterests = data.interests && data.interests.length > 0;
        setHasInterests(hasUserInterests);
      }
    } catch (error) {
      console.error("Error fetching user interests:", error);
    } finally {
      setInterestsLoading(false);
    }
  }, [user]);

  const fetchRecommendations = useCallback(async () => {
    if (!hasInterests || isLoading || recommendationsFetched) return;

    setIsLoading(true);
    try {
      console.log('🧠 [Discover] Getting combined recommendations...');
      const personalizedData = await getPersonalizedRecommendations();
      console.log('✅ [Discover] Combined recommendations successful:', {
        recommendationsCount: personalizedData.recommendations.length,
        predictedInterests: personalizedData.predictedInterests
      });
      setRecommendations(personalizedData.recommendations);
      setPredictedInterests(personalizedData.predictedInterests);
      setUsingPredictedInterests(personalizedData.predictedInterests.length > 0);
      setRecommendationsFetched(true);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  }, [hasInterests, isLoading, recommendationsFetched]);

  const fetchBookmarks = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/bookmarks");
      if (response.ok) {
        const data = await response.json();
        const bookmarkedSet = new Set<string>(
          data.bookmarks.map(
            (bookmark: { locationName: string; locatedCity: string }) =>
              `${bookmark.locationName}-${bookmark.locatedCity}`
          )
        );
        setBookmarkedLocations(bookmarkedSet);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchUserInterests();
  }, [fetchUserInterests]);

  useEffect(() => {
    if (hasInterests && userInterests.length > 0) {
      fetchRecommendations();
    }
  }, [hasInterests, userInterests, fetchRecommendations]);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user, fetchBookmarks]);

  const handleBookmark = async (rec: PersonalizedRecommendation) => {
    if (!user) return;

    const locationKey = `${rec.Location_Name}-${rec.Located_City}`;
    const isBookmarked = bookmarkedLocations.has(locationKey);

    setBookmarkLoading((prev) => new Set(prev).add(locationKey));

    try {
      if (isBookmarked) {
        const response = await fetch("/api/bookmarks", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locationName: rec.Location_Name,
            locatedCity: rec.Located_City,
          }),
        });

        if (response.ok) {
          setBookmarkedLocations((prev) => {
            const newSet = new Set(prev);
            newSet.delete(locationKey);
            return newSet;
          });
        }
      } else {
    const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
      locationId: rec.id,
            locationName: rec.Location_Name,
            locatedCity: rec.Located_City,
            locationType: rec.Location_Type,
            rating: rec.Rating,
            personalizedScore: rec.Sentiment_Score,
          }),
        });

        if (response.ok) {
          setBookmarkedLocations((prev) => new Set(prev).add(locationKey));
        } else if (response.status === 409) {
          setBookmarkedLocations((prev) => new Set(prev).add(locationKey));
        }
      }
    } catch (error) {
      console.error("Error handling bookmark:", error);
    } finally {
      setBookmarkLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(locationKey);
        return newSet;
      });
    }
  };

  const handleExplore = async (rec: PersonalizedRecommendation) => {
    try {
      // If recommendation already includes id, navigate directly
      if (rec.id) {
        router.push(`/locations/${rec.id}`);
        return;
      }

      // Try to resolve location by name via search API
      const searchResp = await fetch(`/api/locations/search?q=${encodeURIComponent(rec.Location_Name)}`);
      if (searchResp.ok) {
        const results = await searchResp.json();
        if (Array.isArray(results) && results.length > 0 && results[0].id) {
          router.push(`/locations/${results[0].id}`);
          return;
        }
      }

      // Fallback to Google search if no location id found
      const searchQuery = `${rec.Location_Name} ${rec.Located_City} Sri Lanka tourist attractions`;
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      window.open(googleSearchUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error('Error resolving location for explore:', error);
      const searchQuery = `${rec.Location_Name} ${rec.Located_City} Sri Lanka tourist attractions`;
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      window.open(googleSearchUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleManualRefresh = useCallback(() => {
    setRecommendationsFetched(false);
    setUsingPredictedInterests(false);
    fetchRecommendations();
  }, [fetchRecommendations]);

  const getLocationIcon = (locationType: string) => {
    const iconClass = "h-5 w-5";
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
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >


            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 text-foreground"
              variants={itemVariants}
            >
              Discover{" "}
              <span className="text-primary">
                Sri Lanka
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12"
              variants={itemVariants}
            >
              Experience the magic of personalized travel recommendations powered by AI
            </motion.p>


          </motion.div>

          {interestsLoading ? (
            <motion.div variants={itemVariants} className="flex justify-center">
              <Card className="max-w-lg bg-card border border-border">
                <CardContent className="p-12 text-center">
                  <motion.div
                    className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl mb-8"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain className="h-10 w-10 text-primary" />
                  </motion.div>
                  <Skeleton className="h-6 w-48 mx-auto mb-4" />
                  <Skeleton className="h-12 w-32 mx-auto" />
                </CardContent>
              </Card>
            </motion.div>
          ) : !hasInterests ? (
            <motion.div variants={itemVariants} className="flex justify-center">
              <Card className="max-w-lg bg-card border border-border">
                <CardContent className="p-12 text-center">
                  <motion.div
                    className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl mb-8"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Heart className="h-10 w-10 text-primary" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Start Your Journey
                  </h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Tell us about your travel preferences and let our AI discover the perfect destinations for you
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all duration-300 rounded-full px-10 py-4 text-lg font-semibold"
                      size="lg"
                      asChild
                    >
                      <a href="/interests">
                        Set Your Interests
                        <ArrowRight className="ml-3 h-5 w-5" />
                      </a>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-12"
              variants={containerVariants}
            >
              {/* Interests & AI Section */}
              <motion.div 
                className="bg-card backdrop-blur-xl rounded-3xl p-8 border border-border"
                variants={itemVariants}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                                             <motion.div
                         className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-2xl"
                         whileHover={{ scale: 1.1, rotate: 5 }}
                       >
                         <Brain className="h-6 w-6 text-primary" />
                       </motion.div>
                       <div>
                         <h3 className="text-xl font-bold text-foreground">
                           {usingPredictedInterests ? "Your Interests & AI Predictions" : "Your Travel Interests"}
                         </h3>
                         <p className="text-muted-foreground text-sm">
                           {usingPredictedInterests 
                             ? "Combined with AI-powered insights for better recommendations"
                             : "Personalized just for you"
                           }
                         </p>
                       </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {/* User Interests */}
                      {userInterests.length > 0 && (
                                                 <div className="flex items-center gap-2">
                           <span className="text-sm font-medium text-muted-foreground">Your:</span>
                           {userInterests.slice(0, 3).map((interest, idx) => (
                             <motion.span
                               key={`user-${idx}`}
                               className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20"
                               initial={{ opacity: 0, scale: 0.8 }}
                               animate={{ opacity: 1, scale: 1 }}
                               transition={{ delay: idx * 0.1 }}
                               whileHover={{ scale: 1.05, y: -2 }}
                             >
                               {getLocationIcon(interest)}
                               {interest}
                             </motion.span>
                           ))}
                           {userInterests.length > 3 && (
                             <motion.span 
                               className="inline-flex items-center px-3 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20"
                               initial={{ opacity: 0, scale: 0.8 }}
                               animate={{ opacity: 1, scale: 1 }}
                               transition={{ delay: 0.3 }}
                             >
                               +{userInterests.length - 3}
                             </motion.span>
                           )}
                         </div>
                      )}

                      {/* AI Predicted Interests */}
                      {usingPredictedInterests && predictedInterests.length > 0 && (
                                                 <div className="flex items-center gap-2">
                           <span className="text-sm font-medium text-muted-foreground">AI:</span>
                           {predictedInterests.slice(0, 3).map((interest, idx) => (
                             <motion.span
                               key={`ai-${idx}`}
                               className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full border border-purple-500/30"
                               initial={{ opacity: 0, scale: 0.8 }}
                               animate={{ opacity: 1, scale: 1 }}
                               transition={{ delay: 0.4 + idx * 0.1 }}
                               whileHover={{ scale: 1.05, y: -2 }}
                             >
                               <Sparkles className="h-4 w-4" />
                               {interest.location_type}
                               <span className="text-xs opacity-75">
                                 {Math.round(interest.confidence * 100)}%
                               </span>
                             </motion.span>
                           ))}
                           {predictedInterests.length > 3 && (
                             <motion.span 
                               className="inline-flex items-center px-3 py-2 bg-purple-500/20 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full border border-purple-500/30"
                               initial={{ opacity: 0, scale: 0.8 }}
                               animate={{ opacity: 1, scale: 1 }}
                               transition={{ delay: 0.7 }}
                             >
                               +{predictedInterests.length - 3}
                             </motion.span>
                           )}
                         </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                                         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => router.push("/interests")}
                         className="border-border hover:border-border/60 rounded-full px-6 py-2"
                       >
                         Edit Interests
                       </Button>
                     </motion.div>
                     
                     {!interestsLoading && (
                       <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                         <Button
                           onClick={handleManualRefresh}
                           disabled={isLoading}
                           variant="outline"
                           size="icon"
                           className="h-12 w-12 rounded-full border-border hover:border-border/60"
                           title="Refresh recommendations"
                         >
                           {isLoading ? (
                             <Loader2 className="h-5 w-5 animate-spin" />
                           ) : (
                             <RefreshCw className="h-5 w-5" />
                           )}
                         </Button>
                       </motion.div>
                     )}
                  </div>
                </div>

                {!interestsLoading && isLoading && recommendations.length === 0 && (
                                     <motion.div 
                     className="flex items-center justify-center gap-4 py-8 mt-6"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                   >
                     <Loader2 className="h-8 w-8 animate-spin text-primary" />
                     <span className="text-muted-foreground text-lg">
                       {usingPredictedInterests 
                         ? "Analyzing your interests and AI predictions..."
                         : "Finding your perfect destinations..."
                       }
                     </span>
                   </motion.div>
                )}

                                 {usingPredictedInterests && predictedInterests.length > 0 && (
                   <motion.div 
                     className="mt-6 p-6 bg-purple-500/10 rounded-2xl border border-purple-500/20"
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.5 }}
                   >
                     <div className="flex items-center gap-3 mb-3">
                       <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                       <span className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                         AI-Powered Insights
                       </span>
                     </div>
                     <p className="text-muted-foreground">
                       Our AI has analyzed your profile and discovered new interests that might surprise you!
                     </p>
                   </motion.div>
                 )}
              </motion.div>

              {/* Recommendations Grid */}
              {recommendations.length > 0 && (
                <motion.div 
                  className="space-y-8"
                  variants={containerVariants}
                >
                                     <motion.div 
                     className="text-center"
                     variants={itemVariants}
                   >
                     <h2 className="text-3xl font-bold text-foreground mb-4">
                       Your Perfect Destinations
                     </h2>
                     <p className="text-muted-foreground max-w-2xl mx-auto">
                       Discover amazing places in Sri Lanka that match your interests and travel style
                     </p>
                   </motion.div>

                  <motion.div 
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                  >
                    {recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        variants={cardVariants}
                        whileHover={{ 
                          scale: 1.03, 
                          y: -8,
                          transition: { duration: 0.3, ease: "easeOut" as const }
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                                                 <Card className="overflow-hidden bg-card backdrop-blur-xl border border-border hover:border-border/60 transition-all duration-300 h-full group">
                          <CardContent className="p-0">
                            {/* Card Header with Image */}
                            <div className="relative h-48 bg-primary/10 overflow-hidden">
                              {rec.imageUrl ? (
                                <Image
                                  src={rec.imageUrl}
                                  alt={rec.Location_Name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                  <motion.div
                                    className="text-primary/60"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                  >
                                    {getLocationIcon(rec.Location_Type)}
                                  </motion.div>
                                </div>
                              )}
                              <motion.div
                                className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                whileHover={{ scale: 1.1 }}
                              />
                              <div className="absolute top-4 right-4">
                                <motion.div 
                                  className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-bold text-white">
                                    {rec.Rating.toFixed(1)}
                                  </span>
                                </motion.div>
                              </div>
                              <div className="absolute bottom-4 left-4">
                                <motion.div
                                  className="inline-flex items-center justify-center w-12 h-12 bg-background/80 backdrop-blur-sm rounded-2xl"
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                  {getLocationIcon(rec.Location_Type)}
                                </motion.div>
                              </div>
                            </div>

                            <div className="p-6">
                              {/* Location Info */}
                                                             <div className="mb-4">
                                 <h3 className="font-bold text-xl mb-2 text-foreground group-hover:text-primary transition-colors">
                                   {rec.Location_Name}
                                 </h3>
                                 <div className="flex items-center gap-2 text-muted-foreground mb-3">
                                   <MapPin className="h-4 w-4" />
                                   <span className="text-sm">{rec.Located_City}</span>
                                 </div>
                               </div>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                <motion.span 
                                  className="inline-block bg-secondary/20 text-secondary-foreground text-xs font-medium px-3 py-1 rounded-full capitalize"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {rec.Location_Type}
                                </motion.span>
                                {rec.reviewCount > 0 && (
                                  <motion.span 
                                    className="inline-block bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-medium px-3 py-1 rounded-full"
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    {rec.reviewCount} reviews
                                  </motion.span>
                                )}
                              </div>
                              
                              {/* Sentiment */}
                              <div className="mb-6">
                                                                 <motion.div 
                                   className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full ${
                                     rec.Sentiment === "Positive" 
                                       ? "bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30" 
                                       : rec.Sentiment === "Negative"
                                       ? "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30"
                                       : "bg-muted text-muted-foreground border border-border"
                                   }`}
                                   whileHover={{ scale: 1.02 }}
                                 >
                                   <Star className="h-4 w-4 fill-current" />
                                   <span>{(rec.Sentiment_Score * 100).toFixed(0)}% positive Reviews</span>
                                 </motion.div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-3">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                                  <Button
                                    variant={
                                      bookmarkedLocations.has(
                                        `${rec.Location_Name}-${rec.Located_City}`
                                      )
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                                                       className={`w-full ${
                                     bookmarkedLocations.has(
                                       `${rec.Location_Name}-${rec.Located_City}`
                                     )
                                       ? "bg-primary hover:bg-primary/90"
                                       : "border-border hover:border-border/60"
                                   }`}
                                    onClick={() => handleBookmark(rec)}
                                    disabled={bookmarkLoading.has(
                                      `${rec.Location_Name}-${rec.Located_City}`
                                    )}
                                  >
                                    {bookmarkLoading.has(
                                      `${rec.Location_Name}-${rec.Located_City}`
                                    ) ? (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : bookmarkedLocations.has(
                                        `${rec.Location_Name}-${rec.Located_City}`
                                      ) ? (
                                      <BookmarkCheck className="h-4 w-4 mr-2" />
                                    ) : (
                                      <Bookmark className="h-4 w-4 mr-2" />
                                    )}
                                    {bookmarkedLocations.has(
                                      `${rec.Location_Name}-${rec.Located_City}`
                                    )
                                      ? "Saved"
                                      : "Save"}
                                  </Button>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                                                                     <Button
                                     variant="outline"
                                     size="sm"
                                     className="w-full border-border hover:border-border/60"
                                    onClick={() => handleExplore(rec)}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Explore
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
