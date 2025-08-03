"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { Sparkles, ArrowRight, Zap, Globe, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  const { isSignedIn } = useAuth();

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
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

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center gap-8 py-24 sm:py-32 md:py-40 text-center px-4 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 w-full h-full -z-10">
        {/* Gradient Background */}
        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-background opacity-80" />
        
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "1s" }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: "2s" }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <motion.div
        className="container max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {isSignedIn ? (
          <>
            <motion.div className="space-y-8" variants={itemVariants}>
              {/* Badge */}
              <motion.div
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary text-sm font-medium rounded-full border border-primary/20 backdrop-blur-sm"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="h-4 w-4 mr-2" />
                Welcome back! Ready to explore?
              </motion.div>

              {/* Main Heading */}
              <motion.h1 
                className="text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl max-w-6xl leading-tight"
                variants={itemVariants}
              >
                Explore{" "}
                <span className="text-primary">
                  Sri Lanka
                </span>
              </motion.h1>

              <motion.p 
                className="max-w-3xl mx-auto text-xl sm:text-2xl text-muted-foreground/80 leading-relaxed"
                variants={itemVariants}
              >
                AI-Powered Travel Discovery for Sri Lanka
              </motion.p>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="h-16 px-12 text-lg font-medium bg-primary hover:bg-primary/90 shadow-2xl hover:shadow-primary/25 transition-all duration-300 rounded-full"
                  size="lg"
                  asChild
                >
                  <Link href="/discover">
                    Discover Destinations
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="h-16 px-12 text-lg font-medium border-2 hover:bg-accent/30 bg-accent/20 transition-all duration-300 rounded-full backdrop-blur-sm"
                  size="lg"
                  asChild
                >
                  <Link href="/interests">Update Interests</Link>
                </Button>
              </motion.div>
            </motion.div>
          </>
        ) : (
          // Content for non-authenticated users
          <>
            <motion.div className="space-y-8" variants={itemVariants}>
              {/* Badge */}
              <motion.div
                className="inline-flex items-center px-6 py-3 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20 backdrop-blur-sm"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="h-4 w-4 mr-2" />
                AI-Powered Travel Discovery
              </motion.div>

              {/* Main Heading */}
              <motion.h1 
                className="text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl max-w-6xl leading-tight"
                variants={itemVariants}
              >
                Discover{" "}
                <span className="text-primary">
                  Sri Lanka
                </span>
                <br />
                <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground/90">
                  Your Way
                </span>
              </motion.h1>

              <motion.p 
                className="max-w-4xl mx-auto text-xl sm:text-2xl text-muted-foreground/80 leading-relaxed"
                variants={itemVariants}
              >
                Experience the Pearl of the Indian Ocean with AI-powered
                recommendations tailored to your unique interests and travel style
              </motion.p>

              {/* Feature Pills */}
              <motion.div 
                className="flex flex-wrap justify-center gap-4 mt-8"
                variants={itemVariants}
              >
                {[
                  { icon: <Globe className="h-4 w-4" />, text: "1000+ Destinations" },
                  { icon: <MapPin className="h-4 w-4" />, text: "AI Recommendations" },
                  { icon: <Star className="h-4 w-4" />, text: "Personalized Matches" },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 text-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    {feature.icon}
                    {feature.text}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center gap-8 mt-16"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="h-16 px-12 text-lg font-medium bg-primary hover:bg-primary/90 shadow-2xl hover:shadow-primary/25 transition-all duration-300 rounded-full"
                  size="lg"
                  asChild
                >
                  <Link href="/sign-up">
                    Start Your Journey
                    <Sparkles className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.p 
                className="text-base text-muted-foreground/70"
                variants={itemVariants}
              >
                Already exploring?{" "}
                <Link
                  href="/sign-in"
                  className="text-primary hover:text-primary/80 font-medium transition-colors hover:underline"
                >
                  Sign In <ArrowRight className="inline h-4 w-4 ml-1" />
                </Link>
              </motion.p>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
