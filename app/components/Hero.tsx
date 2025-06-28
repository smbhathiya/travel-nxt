"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";

export function Hero() {
  const { isSignedIn } = useAuth();

  return (
    <div className="relative container max-w-6xl mx-auto flex flex-col items-center justify-center gap-6 py-20 sm:py-24 md:py-28 text-center">
      <div className="absolute inset-0 w-full h-full -z-10">
        <img
          src="/landing/landing-01.jpg"
          alt="Travel background"
          className="w-full h-full object-cover opacity-20 rounded-xl"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-background/80 rounded-xl" />
      </div>

      {isSignedIn ? (
        // Content for authenticated users
        <>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl px-4">
            Ready to Explore <span className="text-primary">Sri Lanka</span>?
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground px-4">
            Discover amazing destinations in Sri Lanka perfectly matched to your interests
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
            <Button
              className="h-12 px-8 rounded-full text-base"
              size="lg"
              asChild
            >
              <Link href="/find-destinations">Discover Destinations</Link>
            </Button>
            <Button
              variant="outline"
              className="h-12 px-8 rounded-full text-base"
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
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl px-4">
            Discover <span className="text-primary">Sri Lanka</span>,
            Personalized
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground px-4">
            AI-powered travel recommendations for Sri Lanka based on your interests.
            Find your perfect destination in the Pearl of the Indian Ocean.
          </p>
          <div className="flex flex-col items-center gap-4 mt-8">
            <Button
              className="h-12 px-8 rounded-full text-base"
              size="lg"
              asChild
            >
              <Link href="/sign-up">Start Exploring</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
