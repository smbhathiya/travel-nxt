"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, Compass, Star, Mountain, Waves, Landmark, TreePine, Flower2, Shield, Trees, Church, Building2, Fish, Camera } from "lucide-react";
import { Footer } from "../../../../components/landing/Footer";
import { motion } from "framer-motion";

export default function CategoryLocationsPage() {
  const router = useRouter();
  const params = useParams();
  const categoryType = decodeURIComponent(params?.type as string || "");
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
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

  const getCategoryIcon = (categoryType: string) => {
    const iconClass = "h-8 w-8";
    switch (categoryType.toLowerCase()) {
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

  useEffect(() => {
    if (!categoryType) return;
    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(`/api/locations/by-category?category=${encodeURIComponent(categoryType)}`);
        if (!mounted) return;
        if (!res.ok) {
          console.warn('Failed to fetch category locations', res.status);
          setLocations([]);
          return;
        }
        const text = await res.text();
        if (!mounted) return;
        if (!text) {
          setLocations([]);
          return;
        }
        try {
          const data = JSON.parse(text);
          setLocations(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('Invalid JSON for category locations', err, text);
          setLocations([]);
        }
      } catch (err) {
        console.error('Error fetching category locations', err);
        if (mounted) setLocations([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [categoryType]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      
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
          {/* Header Section */}
          <motion.div 
            className="mb-12"
            variants={itemVariants}
          >
            <motion.div 
              className="flex items-center gap-4 mb-8"
              whileHover={{ x: -5 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-border hover:border-border/60 rounded-full px-6 py-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Categories
                </Button>
              </motion.div>
            </motion.div>

            <div className="flex items-center gap-6 mb-8">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {getCategoryIcon(categoryType)}
              </motion.div>
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
                  {categoryType} Locations
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Discover amazing {categoryType.toLowerCase()} destinations in Sri Lanka
                </p>
              </div>
            </div>
          </motion.div>

          {/* Locations Grid */}
          {loading ? (
            <motion.div 
              className="text-center py-16"
              variants={itemVariants}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Compass className="h-8 w-8 text-primary" />
              </motion.div>
              <p className="text-muted-foreground text-lg">Loading locations...</p>
            </motion.div>
          ) : locations.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              variants={containerVariants}
            >
              {locations.map((location) => (
                <motion.div
                  key={location.id}
                  variants={cardVariants}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" as const }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="overflow-hidden bg-card backdrop-blur-xl border border-border hover:border-border/60 transition-all duration-300 cursor-pointer group h-full"
                    onClick={() => router.push(`/locations/${location.id}`)}
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
                            {categoryType}
                          </p>
                        </div>
                      </div>
                      
                      <motion.div 
                        className="flex items-center justify-between"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-primary flex items-center font-medium text-sm">
                          View Details
                          <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                        </span>
                        <motion.div
                          className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Star className="h-4 w-4 text-primary" />
                        </motion.div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-16"
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
                No locations found for this category. Try a different category.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
