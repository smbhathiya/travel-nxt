"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";

export function Hero() {
  const { isSignedIn } = useAuth();

  return (
    <div className="relative container max-w-6xl mx-auto flex flex-col items-center justify-center gap-6 py-24 sm:py-32 md:py-40 text-center">
      <div className="absolute -right-20 top-12 h-72 w-72 rounded-full bg-primary/20 blur-3xl"></div>
      <div className="absolute -left-20 bottom-12 h-72 w-72 rounded-full bg-primary/20 blur-3xl"></div>

      {isSignedIn ? (
        // Content for authenticated users
        <>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl px-4">
            Ready for Your Next <span className="text-primary">Adventure</span>?
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground px-4">
            Find destinations perfectly matched to your interests and travel
            history, with optimal weather conditions.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
            <Button
              className="h-12 px-8 rounded-full text-base"
              size="lg"
              asChild
            >
              <Link href="/find-destinations">Find New Destinations</Link>
            </Button>
            <Button
              variant="outline"
              className="h-12 px-8 rounded-full text-base"
              size="lg"
              asChild
            >
              <Link href="/previous-trips">View My Trips</Link>
            </Button>
          </div>
        </>
      ) : (
        // Content for non-authenticated users
        <>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl px-4">
            Your Next <span className="text-primary">Adventure</span>,
            Personalized
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground px-4">
            AI-powered travel recommendations based on your interests, past
            destinations, and optimal weather conditions for your perfect
            journey.
          </p>
          <div className="flex flex-col items-center gap-4 mt-8">
            <Button
              className="h-12 px-8 rounded-full text-base"
              size="lg"
              asChild
            >
              <Link href="/sign-up">Create Free Account</Link>
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
