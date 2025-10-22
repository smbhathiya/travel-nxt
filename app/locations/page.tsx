"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Search, ArrowRight, Globe, Compass } from "lucide-react";
import { Navbar } from "../../components/landing/Navbar";
import { Footer } from "../../components/landing/Footer";
import { LocationSearchPopover } from "@/components/locations/LocationSearchPopover";
import { useRouter, useSearchParams } from "next/navigation";
import ErrorBoundary from "@/components/ErrorBoundary";
import CategoryGrid from "@/components/locations/CategoryGrid";
import { motion } from "framer-motion";

export default function LocationSearch() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryLocations, setCategoryLocations] = useState<
    { id: string; name: string }[]
  >([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

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
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedCategory) {
      setCategoryLoading(true);
      (async () => {
        try {
          const res = await fetch(`/api/locations/by-category?category=${encodeURIComponent(selectedCategory)}`);
          if (!res.ok) {
            console.warn('Failed to fetch locations by category', res.status);
            setCategoryLocations([]);
            return;
          }
          const text = await res.text();
          if (!text) {
            setCategoryLocations([]);
            return;
          }
          try {
            const data = JSON.parse(text);
            setCategoryLocations(Array.isArray(data) ? data : []);
          } catch (err) {
            console.error('Invalid JSON for category locations', err, text);
            setCategoryLocations([]);
          }
        } catch (err) {
          console.error('Error fetching category locations', err);
          setCategoryLocations([]);
        } finally {
          setCategoryLoading(false);
        }
      })();
    } else {
      setCategoryLocations([]);
    }
  }, [selectedCategory]);

  const handleLocationSelect = (location: string) => {
    router.push(`/locations/${encodeURIComponent(location)}`);
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
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Globe className="h-8 w-8 text-primary" />
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 text-foreground"
              variants={itemVariants}
            >
              Explore <span className="text-primary">Destinations</span>
            </motion.h1>

            <motion.p
              className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12"
              variants={itemVariants}
            >
              Search for destinations in Sri Lanka and discover details,
              ratings, and similar places
            </motion.p>

            <motion.div
              className="w-full max-w-2xl mx-auto relative"
              variants={itemVariants}
            >
                  <ErrorBoundary
                    fallback={
                      <div className="p-6 bg-card border border-border rounded-2xl">
                        <p className="text-center text-muted-foreground">
                          Sorry, the search component couldn&apos;t be loaded.
                          Please try refreshing the page.
                        </p>
                      </div>
                    }
                  >
                    <Suspense
                      fallback={
                        <div className="h-12 sm:h-14 bg-card border border-border animate-pulse rounded-2xl"></div>
                      }
                    >
                      <div className="px-0 sm:px-4">
                        <LocationSearchPopover className="w-full" />
                      </div>
                    </Suspense>
                  </ErrorBoundary>
            </motion.div>
          </motion.div>

          {selectedCategory ? (
            <motion.div className="space-y-8" variants={containerVariants}>
              <motion.div
                className="flex justify-between items-center"
                variants={itemVariants}
              >
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {selectedCategory} Destinations
                  </h2>
                  <p className="text-muted-foreground">
                    Discover amazing {selectedCategory.toLowerCase()} locations
                    in Sri Lanka
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => router.push("/locations")}
                    className="border-border hover:border-border/60 rounded-full px-6 py-2"
                  >
                    <Compass className="h-4 w-4 mr-2" />
                    View All Categories
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                variants={containerVariants}
              >
                {categoryLoading ? (
                  <motion.div
                    className="col-span-full text-center py-12"
                    variants={itemVariants}
                  >
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl mb-4"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Search className="h-8 w-8 text-primary" />
                    </motion.div>
                    <p className="text-muted-foreground text-lg">
                      Loading locations...
                    </p>
                  </motion.div>
                ) : categoryLocations.length > 0 ? (
                  categoryLocations.map((location) => (
                    <motion.div
                      key={location.id}
                      variants={cardVariants}
                      whileHover={{
                        scale: 1.03,
                        y: -8,
                        transition: { duration: 0.3, ease: "easeOut" as const },
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className="overflow-hidden bg-card backdrop-blur-xl border border-border hover:border-border/60 transition-all duration-300 cursor-pointer group h-full"
                        onClick={() => handleLocationSelect(location.name)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <motion.div
                              className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-2xl"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <MapPin className="h-6 w-6 text-primary" />
                            </motion.div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                {location.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {selectedCategory}
                              </p>
                            </div>
                          </div>

                          <motion.div
                            className="flex items-center justify-end"
                            whileHover={{ x: 5 }}
                          >
                            <span className="text-primary flex items-center font-medium text-sm">
                              View Details
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </span>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="col-span-full text-center py-12"
                    variants={itemVariants}
                  >
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-3xl mb-4"
                      whileHover={{ scale: 1.1 }}
                    >
                      <MapPin className="h-8 w-8 text-muted-foreground" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      No locations found
                    </h3>
                    <p className="text-muted-foreground">
                      No locations found for this category. Try a different
                      category.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div className="space-y-8" variants={containerVariants}>
              <motion.div className="text-center" variants={itemVariants}>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Explore by Category
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Browse destinations by category to find exactly what
                  you&apots;re looking for
                </p>
              </motion.div>

              <CategoryGrid />
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
