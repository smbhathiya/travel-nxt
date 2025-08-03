"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowRight, Compass, Star, Mountain, Waves, Landmark, TreePine, Flower2, Shield, Trees, Church, Building2, Fish, Camera } from "lucide-react";
import { motion } from "framer-motion";

export default function CategoryGrid() {
  const [categories, setCategories] = useState<{ type: string; _count: { id: number } }[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    fetch("/api/locations/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <motion.div 
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Compass className="h-8 w-8 text-primary" />
        </motion.div>
        <p className="text-muted-foreground text-lg">Loading categories...</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {categories.map((category, index) => (
        <motion.div
          key={category.type}
          variants={cardVariants}
          whileHover={{ 
            scale: 1.03, 
            y: -8,
            transition: { duration: 0.3, ease: "easeOut" as const }
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            className="h-full bg-card backdrop-blur-xl border border-border hover:border-border/60 transition-all duration-300 cursor-pointer group overflow-hidden"
            onClick={() => router.push(`/locations/category/${encodeURIComponent(category.type)}`)}
          >
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <motion.div 
                  className="p-3 rounded-2xl bg-primary/10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {getCategoryIcon(category.type)}
                </motion.div>
                <motion.span 
                  className="text-sm font-medium bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full border border-secondary/30"
                  whileHover={{ scale: 1.05 }}
                >
                  {category._count.id} locations
                </motion.span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {category.type}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover amazing {category.type.toLowerCase()} destinations in Sri Lanka
                </p>
              </div>
              
              <motion.div 
                className="flex items-center justify-between mt-4 pt-4 border-t border-border"
                whileHover={{ x: 5 }}
              >
                <span className="text-primary flex items-center font-medium text-sm">
                  View locations
                  <ArrowRight className="ml-2 h-4 w-4" />
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
  );
}
