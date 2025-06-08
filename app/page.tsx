import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Award,
  Clock,
  Compass,
  Globe,
  Map,
  Search,
  Star,
  Zap,
  Sun,
  Heart,
  History,
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

export default function Home() {
  const featuredDestinations = [
    {
      id: 1,
      name: "Bali, Indonesia",
      image: "/landing/landing-01.jpg",
      rating: 4.8,
      category: "Beach",
    },
    {
      id: 2,
      name: "Kyoto, Japan",
      image: "/landing/landing-01.jpg",
      rating: 4.9,
      category: "Cultural",
    },
    {
      id: 3,
      name: "Santorini, Greece",
      image: "/landing/landing-01.jpg",
      rating: 4.7,
      category: "Island",
    },
    {
      id: 4,
      name: "Swiss Alps",
      image: "/landing/landing-01.jpg",
      rating: 4.9,
      category: "Mountains",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-background/80"></div>
        <div className="relative container max-w-6xl mx-auto flex flex-col items-center justify-center gap-6 py-24 sm:py-32 md:py-40 text-center">
          <div className="absolute -right-20 top-12 h-72 w-72 rounded-full bg-primary/20 blur-3xl"></div>
          <div className="absolute -left-20 bottom-12 h-72 w-72 rounded-full bg-primary/20 blur-3xl"></div>
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
            <Button className="h-12 px-8 rounded-full text-base" size="lg">
              Create Free Account
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="container max-w-6xl mx-auto px-4 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold sm:text-3xl">How It Works</h2>
            <p className="mt-2 text-muted-foreground">
              Your journey to personalized travel recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 w-16 h-16 mb-4 flex items-center justify-center">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Share Your Interests</h3>
              <p className="text-sm text-muted-foreground">
                Tell us what you love - beaches, hiking, cultural experiences,
                and more
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 w-16 h-16 mb-4 flex items-center justify-center">
                <History className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">
                Previous Destinations
              </h3>
              <p className="text-sm text-muted-foreground">
                Log your travel history to help us understand your preferences
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 w-16 h-16 mb-4 flex items-center justify-center">
                <Globe className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Select Country</h3>
              <p className="text-sm text-muted-foreground">
                Choose where you'd like to explore next
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 w-16 h-16 mb-4 flex items-center justify-center">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">
                Get AI Recommendations
              </h3>
              <p className="text-sm text-muted-foreground">
                Receive personalized suggestions with weather insights
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container max-w-6xl mx-auto">
          <div className="mt-16 sm:mt-20 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-10 px-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-card rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow">
                <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 w-16 h-16 mb-6 flex items-center justify-center">
                  <Compass className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  AI-Powered Discovery
                </h3>
                <p className="text-muted-foreground">
                  Our advanced AI analyzes your interests and past travels to
                  suggest destinations you'll love
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-card rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow">
                <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 w-16 h-16 mb-6 flex items-center justify-center">
                  <Sun className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Weather Forecasting
                </h3>
                <p className="text-muted-foreground">
                  Get insights on upcoming weather conditions to plan the
                  perfect trip timing
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-card rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow">
                <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 w-16 h-16 mb-6 flex items-center justify-center">
                  <Map className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Personalized Matches
                </h3>
                <p className="text-muted-foreground">
                  Discover destinations that match your unique preferences and
                  travel style
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* End of Features Section */}
      </section>

      {/* Popular Destinations Section */}
      <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden w-full">
        <div className="absolute -left-40 top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="container max-w-6xl mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Popular <span className="text-primary">Destinations</span>
              </h2>
              <p className="mt-2 text-muted-foreground max-w-2xl">
                Explore trending locations that match various travel interests
              </p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0 rounded-full">
              View All Destinations
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredDestinations.map((destination) => (
              <Card
                key={destination.id}
                className="overflow-hidden group border-none mx-auto w-full max-w-sm sm:max-w-none"
              >
                <div className="relative h-56 overflow-hidden rounded-t-lg">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 rounded-full px-2 py-1 text-xs font-medium flex items-center shadow-sm">
                    <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                    <span>{destination.rating}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-primary/80 text-primary-foreground rounded-full px-3 py-1 text-xs font-medium">
                    {destination.category}
                  </div>
                </div>
                <CardContent className="p-4 bg-card rounded-b-lg shadow-sm">
                  <h3 className="font-medium text-lg">{destination.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>5-7 days</span>
                    </div>
                    <Link
                      href={`/destination/${destination.id}`}
                      className="text-primary hover:underline text-sm flex items-center"
                    >
                      Explore <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-muted/30 w-full">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              What Our <span className="text-primary">Travelers Say</span>
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg max-w-3xl mx-auto">
              Hear from travelers who found their perfect destinations with
              AI-powered recommendations
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <Card className="bg-card border-none shadow-sm mx-auto w-full max-w-sm sm:max-w-none">
              <CardContent className="pt-8 px-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <p className="italic text-muted-foreground">
                  "The AI recommendations were spot-on! It suggested a beach
                  destination I'd never considered but matched my interests
                  perfectly. Even predicted great weather for my visit."
                </p>
                <div className="mt-6 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-medium text-primary">SJ</span>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">Beach Lover</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-none shadow-sm">
              <CardContent className="pt-8 px-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <p className="italic text-muted-foreground">
                  "As a hiking enthusiast, I was amazed how the app considered
                  my previous mountain trips and suggested new trails that
                  matched my experience level. The weather forecast feature was
                  invaluable."
                </p>
                <div className="mt-6 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-medium text-primary">MT</span>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Michael Torres</p>
                    <p className="text-sm text-muted-foreground">
                      Hiking Enthusiast
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-none shadow-sm">
              <CardContent className="pt-8 px-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <p className="italic text-muted-foreground">
                  "I entered my interest in cultural experiences and historical
                  sites, and the AI suggested destinations that perfectly
                  aligned with my tastes. I discovered hidden gems I wouldn't
                  have found otherwise."
                </p>
                <div className="mt-6 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-medium text-primary">EC</span>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Emma Chen</p>
                    <p className="text-sm text-muted-foreground">
                      Culture Explorer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 sm:py-20 relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="container max-w-6xl mx-auto px-4 relative text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
            Find Your Perfect Destination Today
          </h2>
          <p className="max-w-2xl mx-auto text-primary-foreground/80 mb-8 md:text-lg">
            Create your free account, share your interests, and let our AI find
            destinations that match your travel style
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="rounded-full">
              Create Free Account
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-primary-foreground/20 hover:bg-primary-foreground/10"
            >
              How It Works
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
