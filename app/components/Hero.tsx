"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { Sparkles, ArrowRight, Star, MapPin, Zap } from "lucide-react";

export function Hero() {
  const { isSignedIn } = useAuth();

  return (
    <div className="relative container max-w-7xl mx-auto flex flex-col items-center justify-center gap-4 py-12 sm:py-16 md:py-20 text-center px-4">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full -z-20 rounded-3xl overflow-hidden">
        <img
          src="/landing/landing-01.jpg"
          alt="Sri Lanka landscape"
          className="w-full h-full object-cover opacity-20 blur-sm"
          draggable={false}
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10" />

      {isSignedIn ? (
        // Content for authenticated users
        <>
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4 mr-2" />
              Ready for your next adventure?
            </div>
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl">
              Explore <span className="text-primary">Sri Lanka</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl sm:text-2xl text-muted-foreground/80 leading-relaxed">
              Discover personalized destinations crafted just for you
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-12">
            <Button
              className="h-14 px-10 rounded-2xl text-lg font-medium bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
              asChild
            >
              <Link href="/discover">
                Discover Destinations
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-14 px-10 rounded-2xl text-lg font-medium border-2 hover:bg-accent/50 transition-all duration-300"
              size="lg"
              asChild
            >
              <Link href="/interests">Update Interests</Link>
            </Button>
          </div>
        </>
      ) : (
        // Content for non-authenticated users
        <>
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Zap className="h-4 w-4 mr-2" />
              AI-Powered Travel Discovery
            </div>
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl">
              Discover <span className="text-primary">Sri Lanka</span>
              <br />
              <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                Your Way
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-xl sm:text-2xl text-muted-foreground/80 leading-relaxed">
              Experience the Pearl of the Indian Ocean with AI-powered
              recommendations tailored to your unique interests and travel style
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 mt-12">
            <Button
              className="h-14 px-10 rounded-2xl text-lg font-medium bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
              asChild
            >
              <Link href="/sign-up">
                Start Your Journey
                <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-base text-muted-foreground/70">
              Already exploring?{" "}
              <Link
                href="/sign-in"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign In <ArrowRight className="inline h-4 w-4 ml-1" />
              </Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
