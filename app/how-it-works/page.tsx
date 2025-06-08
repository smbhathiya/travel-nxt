import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, History, Globe, Sun, Zap, Brain, Database } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <Heart className="h-10 w-10 text-primary" />,
      title: "Share Your Travel Interests",
      description:
        "Tell us what you love about traveling - beaches, hiking, cultural sites, food experiences, and more. The more specific you are, the better we can tailor our recommendations.",
    },
    {
      icon: <History className="h-10 w-10 text-primary" />,
      title: "Add Your Travel History",
      description:
        "Share places you've visited before. This helps our AI understand your travel patterns and preferences, even ones you might not explicitly mention.",
    },
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: "Choose Your Desired Region",
      description:
        "Select a country or region you're interested in exploring. Our system will focus on finding the best destinations within that area.",
    },
    {
      icon: <Sun className="h-10 w-10 text-primary" />,
      title: "Weather Analysis",
      description:
        "We analyze weather patterns and forecasts to suggest the ideal times to visit your potential destinations, ensuring you have the best possible experience.",
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Get Personalized Recommendations",
      description:
        "Receive a curated list of destinations that match your interests, travel history, and preferred weather conditions, with detailed information about each one.",
    },
  ];

  const aiFeatures = [
    {
      icon: <Brain className="h-16 w-16 text-primary" />,
      title: "AI Algorithm",
      description:
        "Our advanced AI analyzes thousands of destinations and matches them with your unique preferences. It considers factors like your stated interests, past travel patterns, seasonal conditions, and more to find destinations you'll love.",
    },
    {
      icon: <Database className="h-16 w-16 text-primary" />,
      title: "Travel Database",
      description:
        "We maintain a comprehensive database of destinations, activities, and local information that is constantly updated. This ensures you get accurate and current recommendations for your travels.",
    },
    {
      icon: <Sun className="h-16 w-16 text-primary" />,
      title: "Weather Integration",
      description:
        "By integrating with weather APIs, we analyze climate patterns for destinations throughout the year, helping you plan trips with optimal weather conditions based on your preferences.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-6">
              How Smart Traveller Works
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Our AI-powered platform helps you discover destinations perfectly
              matched to your unique preferences and travel style
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Step-by-step Process */}
        <section className="py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Your Journey to Perfect Recommendations
            </h2>

            <div className="space-y-12 relative">
              {/* Vertical line connector */}
              <div className="absolute left-8 top-12 bottom-20 w-0.5 bg-muted hidden md:block"></div>

              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-center md:items-start gap-6"
                >
                  <div className="bg-muted/50 rounded-full p-4 z-10 relative">
                    {step.icon}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold mb-3">
                      Step {index + 1}: {step.title}
                    </h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Behind It */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4 text-center">
              The Technology Behind Smart Traveller
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              Our recommendations are powered by cutting-edge AI and data
              analysis that work together to find your perfect destinations
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {aiFeatures.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-8 px-6 pb-6">
                    <div className="flex justify-center mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Discover Your Perfect Destination?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Create your free account today and let our AI find destinations
              tailored to your preferences
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">Get Started Now</Link>
            </Button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
