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
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 w-full h-full -z-10 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(0,191,255,0.15),rgba(255,255,255,0))]" />
      </div>
      
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full flex-1">
        <div className="relative z-10">
          <Hero />
          
          {/* Spacing */}
          <div className="h-8 sm:h-12" />
          
          {!isSignedIn && <HowItWorks />}

          <Features />
          
          {/* Spacing */}
          <div className="h-16 sm:h-24" />
        </div>
      </section>

      <Testimonials />

      <CTASection />

      <Footer />
    </div>
  );
}
