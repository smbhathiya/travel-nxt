"use client";

import { Brain, Heart, MapPin, Sparkles, TrendingUp, Users, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-20">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="text-center mb-20"
      >

        
        <motion.h2 
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-foreground"
          variants={itemVariants}
        >
          Travel Smarter, Not Harder
        </motion.h2>
        
        <motion.p 
          className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Our AI-powered platform revolutionizes how you discover Sri Lanka's hidden gems
        </motion.p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {[
          {
            icon: <Brain className="h-8 w-8" />,
            title: "AI-Powered Discovery",
            desc: "Advanced algorithms analyze your preferences to suggest perfect destinations tailored just for you",
            gradient: "from-blue-500 to-cyan-500",
            delay: 0.1,
          },
          {
            icon: <Heart className="h-8 w-8" />,
            title: "Interest-Based Matching",
            desc: "Get personalized recommendations based on your unique travel interests and lifestyle preferences",
            gradient: "from-pink-500 to-rose-500",
            delay: 0.2,
          },
          {
            icon: <MapPin className="h-8 w-8" />,
            title: "Sri Lanka Expertise",
            desc: "Discover both iconic landmarks and hidden gems across the beautiful Pearl of the Indian Ocean",
            gradient: "from-green-500 to-emerald-500",
            delay: 0.3,
          },
          {
            icon: <Sparkles className="h-8 w-8" />,
            title: "Smart Recommendations",
            desc: "Real-time ratings, reviews, and personalized match scores for informed travel decisions",
            gradient: "from-purple-500 to-violet-500",
            delay: 0.4,
          },
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05, 
              y: -10,
              transition: { duration: 0.3, ease: "easeOut" as const }
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative"
          >
            <div className="relative bg-white/5 backdrop-blur-sm p-8 h-full border border-white/10 hover:border-white/20 transition-all duration-300 rounded-2xl overflow-hidden">
              {/* Gradient background on hover */}
              <motion.div 
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.1 }}
              />
              
              {/* Icon */}
              <motion.div 
                className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-lg rounded-2xl`}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.3, ease: "easeOut" as const }
                }}
              >
                {feature.icon}
              </motion.div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Stats section */}
     
    </div>
  );
}
