"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Footer } from "../../components/landing/Footer";
import { Navbar } from "../../components/landing/Navbar";
import {
  Heart,
  ArrowRight,
  Check,
  Sparkles,
  Waves,
  Landmark,
  TreePine,
  Flower2,

  Trees,
  Church,
  Building2,
  Fish,
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

type Interest = {
  id: string;
  name: string;
  icon: React.ReactNode;
};

export default function InterestsPage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [hasExistingInterests, setHasExistingInterests] = useState(false);
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { toast } = useToast();

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

  const interests: Interest[] = [
    { id: "beaches", name: "Beaches", icon: <Waves className="h-8 w-8" /> },
    {
      id: "bodies of water",
      name: "Bodies of Water",
      icon: <Fish className="h-8 w-8" />,
    },
    {
      id: "farms",
      name: "Farms",
      icon: <TreePine className="h-8 w-8" />,
    },
    {
      id: "gardens",
      name: "Gardens",
      icon: <Flower2 className="h-8 w-8" />,
    },
    {
      id: "historic sites",
      name: "Historic Sites",
      icon: <Landmark className="h-8 w-8" />,
    },
    {
      id: "museums",
      name: "Museums",
      icon: <Building2 className="h-8 w-8" />,
    },
    {
      id: "national parks",
      name: "National Parks",
      icon: <Trees className="h-8 w-8" />,
    },
    {
      id: "nature & wildlife areas",
      name: "Nature & Wildlife Areas",
      icon: <Trees className="h-8 w-8" />,
    },
    {
      id: "waterfalls",
      name: "Waterfalls",
      icon: <Waves className="h-8 w-8" />,
    },
    {
      id: "zoological gardens",
      name: "Zoological Gardens",
      icon: <Fish className="h-8 w-8" />,
    },
    {
      id: "religious sites",
      name: "Religious Sites",
      icon: <Church className="h-8 w-8" />,
    },
  ];

  useEffect(() => {
    const fetchExistingInterests = async () => {
      if (!user) {
        setIsFetching(false);
        return;
      }

      try {
        const response = await fetch("/api/user/interests");
        if (response.ok) {
          const data = await response.json();
          if (data.interests && data.interests.length > 0) {
            setSelectedInterests(data.interests);
            setHasExistingInterests(true);
          }
        }
      } catch (error) {
        console.error("Error fetching interests:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchExistingInterests();
  }, [user]);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id)
        ? prev.filter((interest) => interest !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/interests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interests: selectedInterests }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your interests have been saved successfully!",
        });
        router.push("/discover");
      } else {
        throw new Error("Failed to save interests");
      }
    } catch (error) {
      console.error("Error saving interests:", error);
      toast({
        title: "Error",
        description: "Failed to save your interests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
                  <Heart className="h-8 w-8 text-primary" />
                </motion.div>
                <p className="text-muted-foreground">Loading interests...</p>
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
                  Please sign in to manage your interests.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
          {isFetching ? (
            <motion.div 
              className="space-y-12"
              variants={containerVariants}
            >
              {/* Skeleton for header */}
              <motion.div className="text-center mb-12" variants={itemVariants}>
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Heart className="h-8 w-8 text-primary" />
                </motion.div>
                <Skeleton className="h-12 w-96 mx-auto mb-4 bg-card" />
                <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-2 bg-card" />
                <Skeleton className="h-6 w-3/4 max-w-xl mx-auto bg-card" />
              </motion.div>

              {/* Skeleton for interest cards */}
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                variants={containerVariants}
              >
                {Array.from({ length: 11 }).map((_, index) => (
                  <motion.div key={index} variants={cardVariants}>
                    <Card className="p-6 flex flex-col items-center justify-center aspect-square bg-card border border-border">
                      <Skeleton className="h-8 w-8 mb-3 bg-muted" />
                      <Skeleton className="h-4 w-20 bg-muted" />
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Skeleton for buttons */}
              <motion.div className="flex justify-center gap-4" variants={itemVariants}>
                <Skeleton className="h-12 w-full max-w-xs bg-card" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-12"
              variants={containerVariants}
            >
              {/* Header Section */}
              <motion.div 
                className="text-center mb-12"
                variants={itemVariants}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Heart className="h-8 w-8 text-primary" />
                </motion.div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-foreground">
                  {hasExistingInterests
                    ? "Update Your Travel Interests"
                    : "What Are Your Travel Interests?"}
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6">
                  {hasExistingInterests
                    ? "Modify your selections to get better recommendations for destinations in Sri Lanka."
                    : "Select all that apply. We'll recommend amazing destinations in Sri Lanka based on your interests."}
                </p>
                
                {hasExistingInterests && (
                  <motion.div 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      You currently have {selectedInterests.length} interest
                      {selectedInterests.length !== 1 ? "s" : ""} selected
                    </span>
                  </motion.div>
                )}
              </motion.div>

              {/* Interests Grid */}
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                variants={containerVariants}
              >
                {interests.map((interest) => (
                  <motion.div
                    key={interest.id}
                    variants={cardVariants}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8,
                      transition: { duration: 0.3, ease: "easeOut" as const }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-300 p-6 flex flex-col items-center justify-center aspect-square group overflow-hidden relative ${
                        selectedInterests.includes(interest.id)
                          ? "bg-primary/10 border-primary shadow-lg shadow-primary/25"
                          : "bg-card border border-border hover:border-border/60 hover:shadow-lg"
                      }`}
                      onClick={() => toggleInterest(interest.id)}
                    >
                      <motion.div
                        className={`mb-4 transition-all duration-300 ${
                          selectedInterests.includes(interest.id)
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-primary"
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {interest.icon}
                      </motion.div>
                      
                      <span className={`text-sm font-medium text-center transition-colors ${
                        selectedInterests.includes(interest.id)
                          ? "text-primary font-semibold"
                          : "text-foreground group-hover:text-primary"
                      }`}>
                        {interest.name}
                      </span>
                      
                      {selectedInterests.includes(interest.id) && (
                        <motion.div
                          className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </motion.div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="flex justify-center gap-4"
                variants={itemVariants}
              >
                {hasExistingInterests && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/discover")}
                      className="border-border hover:border-border/60 rounded-full px-8 py-3 text-lg font-semibold"
                      size="lg"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                )}
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || selectedInterests.length === 0}
                    className="bg-primary hover:bg-primary/90 rounded-full px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-primary/25 transition-all duration-300"
                    size="lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {hasExistingInterests ? "Update Interests" : "Continue"}
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
