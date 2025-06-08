"use client";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Features } from "./components/Features";
import { Testimonials } from "./components/Testimonials";
import { CTASection } from "./components/CTASection";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 w-full h-full -z-10">
        <img
          src="/landing/landing-01.jpg"
          alt="Travel background"
          className="w-full h-full object-cover opacity-20"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-background/80" />
      </div>
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full">
        <div className="relative z-10">
          <Hero />
          <div className="h-4 sm:h-6" />
          {!isSignedIn && <HowItWorks />}

          <Features />
          <div className="h-16 sm:h-24" />
        </div>
      </section>

      {!isSignedIn && <Testimonials />}

      <CTASection />

      <Footer />
    </div>
  );
}
