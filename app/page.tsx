"use client";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Features } from "./components/Features";
import { PopularDestinations } from "./components/PopularDestinations";
import { Testimonials } from "./components/Testimonials";
import { CTASection } from "./components/CTASection";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-background/80"></div>

        <Hero />

        {/* Show How It Works only for non-authenticated users */}
        {!isSignedIn && <HowItWorks />}

        {/* Features Section - show for all users */}
        <Features />
      </section>

      {/* Popular Destinations Section */}
      <PopularDestinations />

      {/* Testimonials - show only for non-authenticated users */}
      {!isSignedIn && <Testimonials />}

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  );
}
