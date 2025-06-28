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
