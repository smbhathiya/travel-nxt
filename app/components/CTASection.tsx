"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export function CTASection() {
  const { isSignedIn } = useAuth();

  return (
    <section className="bg-primary text-primary-foreground py-16 sm:py-20 relative overflow-hidden w-full">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      <div className="container max-w-6xl mx-auto px-4 relative text-center">
        {isSignedIn ? (
          <>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              Ready to Discover Your Next Destination?
            </h2>
            <p className="max-w-2xl mx-auto text-primary-foreground/80 mb-8 md:text-lg">
              Let our AI find the perfect match based on your interests and
              travel history
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full"
                asChild
              >
                <Link href="/find-destinations">Find Destinations</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-primary-foreground/20 hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              Find Your Perfect Destination Today
            </h2>
            <p className="max-w-2xl mx-auto text-primary-foreground/80 mb-8 md:text-lg">
              Create your free account, share your interests, and let our AI
              find destinations that match your travel style
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full"
                asChild
              >
                <Link href="/sign-up">Create Free Account</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-primary-foreground/20 hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/how-it-works">How It Works</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
