"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Footer } from "../../components/landing/Footer";
import { Navbar } from "../../components/landing/Navbar";
import {
  Heart,
  Calendar,
  ArrowRight,
  Bookmark,
  MapPin,
  Star,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

interface BookmarkItem {
  id: string;
  locationName: string;
  locatedCity: string;
  locationType: string;
  rating: number;
  personalizedScore: number;
  createdAt: string;
}

export default function BookmarksPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!isLoaded || !user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch("/api/bookmarks");
        if (response.ok) {
          const data = await response.json();
          setBookmarks(data.bookmarks || []);
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        toast({
          title: "Error",
          description: "Failed to load bookmarks",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [isLoaded, user, toast]);

  const handleRemoveBookmark = async (bookmarkId: string) => {
    try {
      const bk = bookmarks.find((b) => b.id === bookmarkId);
      if (!bk) {
        toast({
          title: "Error",
          description: "Bookmark not found",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`/api/bookmarks`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationName: bk.locationName,
          locatedCity: bk.locatedCity,
        }),
      });

      if (response.ok) {
        setBookmarks((prev) =>
          prev.filter((bookmark) => bookmark.id !== bookmarkId)
        );
        toast({
          title: "Success",
          description: "Bookmark removed successfully",
        });
      } else {
        const errText = await response
          .text()
          .catch(() => "Failed to remove bookmark");
        console.error("Failed to remove bookmark:", errText);
        toast({
          title: "Error",
          description: "Failed to remove bookmark",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to remove bookmark",
        variant: "destructive",
      });
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="max-w-md mx-auto bg-card border border-border">
              <CardContent className="p-8 text-center">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Bookmark className="h-8 w-8 text-primary" />
                </motion.div>
                <p className="text-muted-foreground">Loading bookmarks...</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="max-w-md mx-auto bg-card border border-border">
              <CardContent className="p-8 text-center">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Heart className="h-8 w-8 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Sign In Required
                </h3>
                <p className="text-muted-foreground mb-6">
                  Please sign in to view your bookmarks.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => router.push("/sign-in")}
                    className="bg-primary hover:bg-primary/90 rounded-full px-6 py-2"
                  >
                    Sign In
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

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
          className="container max-w-6xl mx-auto px-4 py-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Bookmark className="h-8 w-8 text-primary" />
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-foreground">
              My Bookmarks
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your saved destinations and favorite places
            </p>
          </motion.div>

          {isLoading ? (
            <motion.div className="space-y-8" variants={containerVariants}>
              <motion.div
                className="flex items-center justify-center"
                variants={itemVariants}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="h-8 w-8 text-primary" />
                </motion.div>
              </motion.div>
            </motion.div>
          ) : bookmarks.length === 0 ? (
            <motion.div className="text-center" variants={itemVariants}>
              <motion.div
                className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-3xl mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Bookmark className="h-12 w-12 text-primary" />
              </motion.div>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                No Bookmarks Yet
              </h3>

              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start exploring destinations and bookmark your favorite places
                to see them here.
              </p>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => router.push("/locations")}
                  className="bg-primary hover:bg-primary/90 rounded-full px-8 py-3 text-lg font-semibold"
                >
                  Discover Locations
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              {bookmarks.map((bookmark) => (
                <motion.div key={bookmark.id} variants={cardVariants}>
                  <Card className="bg-card backdrop-blur-xl border border-border hover:border-border/60 transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          <span className="text-sm text-muted-foreground">
                            {bookmark.locationType}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-foreground">
                            {bookmark.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {bookmark.locationName}
                      </h3>

                      <p className="text-muted-foreground mb-4">
                        {bookmark.locatedCity}
                      </p>

                      <div className="flex items-center gap-2 mb-4">
                        {/* <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/10 rounded-full">
                          <Sparkles className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                          <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                            {(bookmark.personalizedScore * 100).toFixed(1)}% match
                          </span>
                        </div> */}
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 rounded-full">
                          <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                            {new Date(bookmark.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-border hover:border-border/60 rounded-full"
                          onClick={() =>
                            router.push(`/locations/${bookmark.id}`)
                          }
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border hover:border-border/60 rounded-full"
                          onClick={() => handleRemoveBookmark(bookmark.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
