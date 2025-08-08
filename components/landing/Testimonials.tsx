"use client";

import { Star, Quote, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function Testimonials() {
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

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      text: "TravelNxt completely transformed my Sri Lanka trip! The AI recommendations were spot-on and led me to hidden gems I never would have found on my own.",
      avatar: "SJ",
      gradient: "from-blue-500 to-cyan-500",
      destination: "Sigiriya & Kandy",
    },
    {
      name: "David Chen",
      location: "Singapore",
      rating: 5,
      text: "As a solo traveler, I was worried about planning my trip. TravelNxt made it so easy with personalized suggestions that matched my interests perfectly.",
      avatar: "DC",
      gradient: "from-green-500 to-emerald-500",
      destination: "Galle & Mirissa",
    },
    {
      name: "Emma Rodriguez",
      location: "London, UK",
      rating: 5,
      text: "The AI-powered recommendations were incredible! It suggested places that perfectly matched my love for culture and history. My trip was unforgettable!",
      avatar: "ER",
      gradient: "from-purple-500 to-violet-500",
      destination: "Anuradhapura & Polonnaruwa",
    },
    {
      name: "Michael Kim",
      location: "Seoul, South Korea",
      rating: 5,
      text: "TravelNxt helped me discover the most beautiful beaches and wildlife sanctuaries. The personalized approach made my Sri Lanka adventure truly special.",
      avatar: "MK",
      gradient: "from-orange-500 to-red-500",
      destination: "Yala & Bentota",
    },
  ];

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
          Real Stories, Real Adventures
        </motion.h2>

        <motion.p
          className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Discover how TravelNxt has helped thousands of travelers create
          unforgettable experiences in Sri Lanka
        </motion.p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {testimonials.map((testimonial, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            whileHover={{
              scale: 1.02,
              y: -5,
              transition: { duration: 0.3, ease: "easeOut" as const },
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative"
          >
            <div className="relative bg-white/5 backdrop-blur-sm p-8 h-full border border-white/10 hover:border-white/20 transition-all duration-300 rounded-2xl overflow-hidden">
              {/* Gradient background on hover */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.05 }}
              />

              {/* Quote Icon */}
              <motion.div
                className="absolute top-6 right-6 text-muted-foreground/30"
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
                }
                transition={{
                  delay: 0.5 + idx * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                }}
              >
                <Quote className="h-8 w-8" />
              </motion.div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={
                      isInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0 }
                    }
                    transition={{
                      delay: 0.6 + idx * 0.1 + i * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 10,
                    }}
                  >
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
              </div>

              {/* Testimonial Text */}
              <motion.p
                className="text-muted-foreground leading-relaxed mb-6 text-lg"
                variants={itemVariants}
              >
                &quot;{testimonial.text}&quot;
              </motion.p>

              {/* Destination */}
              <motion.div
                className="flex items-center gap-2 mb-6 text-sm text-primary/80"
                initial={{ opacity: 0, x: -20 }}
                animate={
                  isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                }
                transition={{
                  delay: 0.7 + idx * 0.1,
                  duration: 0.5,
                  ease: "easeOut" as const,
                }}
              >
                <MapPin className="h-4 w-4" />
                <span className="font-medium">
                  Visited: {testimonial.destination}
                </span>
              </motion.div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <motion.div
                  className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} text-white rounded-full flex items-center justify-center font-semibold`}
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    transition: { duration: 0.3, ease: "easeOut" as const },
                  }}
                >
                  {testimonial.avatar}
                </motion.div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div
        className="mt-20 text-center"
        variants={itemVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      ></motion.div>
    </div>
  );
}
