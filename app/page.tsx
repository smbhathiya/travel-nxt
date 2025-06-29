"use client";

import { Navbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";
import { Hero } from "../components/landing/Hero";
import { HowItWorks } from "../components/landing/HowItWorks";
import { Features } from "../components/landing/Features";
import { Testimonials } from "../components/landing/Testimonials";
import { CTASection } from "../components/landing/CTASection";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div className="relative flex flex-col min-h-screen bg-transparent">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full flex-1 bg-transparent">
        <div className="relative bg-transparent">
          <Hero />

          {/* Spacing */}
          <div className="h-4 sm:h-6" />

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
