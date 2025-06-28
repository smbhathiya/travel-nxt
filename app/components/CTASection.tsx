"use client";

import { useAuth } from "@clerk/nextjs";
import { Rocket, Star } from "lucide-react";

export function CTASection() {
  const { isSignedIn } = useAuth();

  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      {/* Primary color background */}
      <div className="absolute inset-0 bg-primary" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />

      <div className="container max-w-6xl mx-auto px-4 relative">
        {isSignedIn ? (
          <div className="text-center text-white">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-sm font-medium mb-8">
              <Rocket className="h-4 w-4 mr-2" />
              Ready for Adventure?
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your Next{" "}
              <span className="text-white">
                Adventure
              </span>{" "}
              <br />
              Awaits in Sri Lanka
            </h2>
            
            <p className="max-w-3xl mx-auto text-white/80 mb-10 text-lg sm:text-xl leading-relaxed">
              Let our AI discover personalized destinations that match your unique interests and create unforgettable memories
            </p>
          </div>
        ) : (
          <div className="text-center text-white">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-sm font-medium mb-8">
              <Star className="h-4 w-4 mr-2" />
              Join Thousands of Travelers
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Start Your{" "}
              <span className="text-white">
                Sri Lankan
              </span>{" "}
              <br />
              Journey Today
            </h2>
            
            <p className="max-w-3xl mx-auto text-white/80 mb-10 text-lg sm:text-xl leading-relaxed">
              Join our community of explorers and discover Sri Lanka like never before. 
              Create your free account and unlock personalized travel experiences.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
