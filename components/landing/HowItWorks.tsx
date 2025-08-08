"use client";

import { Heart, MapPin, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.3,
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

  const stepVariants = {
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

  const steps = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Share Your Interests",
      desc: "Tell us what you love - beaches, mountains, cultural sites, national parks, and more",
      gradient: "from-pink-500 to-rose-500",
      features: [
        "Select from 10+ categories",
        "Custom preferences",
        "Travel style input",
      ],
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "AI Magic",
      desc: "Our AI analyzes your preferences and matches you with perfect destinations in Sri Lanka",
      gradient: "from-yellow-500 to-orange-500",
      features: [
        "Advanced algorithms",
        "Pattern recognition",
        "Personalized scoring",
      ],
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Discover & Explore",
      desc: "Get personalized recommendations with ratings and discover your next adventure in Sri Lanka",
      gradient: "from-green-500 to-emerald-500",
      features: [
        "Curated destinations",
        "Detailed insights",
        "Easy booking links",
      ],
    },
  ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-20 sm:py-24">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="text-center mb-20"
      >
        <motion.div
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary text-sm font-medium rounded-full border border-primary/20 backdrop-blur-sm mb-8"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="h-4 w-4 mr-2" />
          Simple 3-Step Process
        </motion.div>

        <motion.h2
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-foreground"
          variants={itemVariants}
        >
          How It Works
        </motion.h2>

        <motion.p
          className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Your journey to discovering Sri Lanka&apots;s best destinations in
          just three simple steps
        </motion.p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 mb-20"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            variants={stepVariants}
            whileHover={{
              scale: 1.05,
              y: -10,
              transition: { duration: 0.3, ease: "easeOut" as const },
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative"
          >
            {/* Step Number */}
            <motion.div
              className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg"
              initial={{ scale: 0, rotate: -180 }}
              animate={
                isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }
              }
              transition={{
                delay: 0.5 + idx * 0.2,
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
            >
              {idx + 1}
            </motion.div>

            <div className="relative bg-white/5 backdrop-blur-sm p-8 h-full border border-white/10 hover:border-white/20 transition-all duration-300 rounded-2xl overflow-hidden">
              {/* Gradient background on hover */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.1 }}
              />

              {/* Icon */}
              <motion.div
                className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${step.gradient} text-white mb-6 shadow-lg rounded-2xl`}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.3, ease: "easeOut" as const },
                }}
              >
                {step.icon}
              </motion.div>

              {/* Content */}
              <h3 className="font-semibold text-2xl mb-4 text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {step.desc}
              </p>

              {/* Features List */}
              <div className="space-y-3">
                {step.features.map((feature, featureIdx) => (
                  <motion.div
                    key={featureIdx}
                    className="flex items-center gap-3 text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                      isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                    }
                    transition={{
                      delay: 0.8 + idx * 0.2 + featureIdx * 0.1,
                      duration: 0.5,
                      ease: "easeOut" as const,
                    }}
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Arrow connector (except for last item) */}
            {idx < steps.length - 1 && (
              <motion.div
                className="hidden lg:block absolute top-1/2 -right-8 transform -translate-y-1/2"
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
                }
                transition={{
                  delay: 1 + idx * 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center border border-primary/20 backdrop-blur-sm">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="text-center"
        variants={itemVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl border border-primary/20 backdrop-blur-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="h-5 w-5 mr-3 text-primary" />
          <span className="text-lg font-medium text-foreground">
            Ready to start your journey? Get personalized recommendations now!
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
