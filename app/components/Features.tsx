import { Brain, Heart, MapPin, Sparkles } from "lucide-react";

export function Features() {
  return (
    <div className="container max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          Why TravelNxt?
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Travel Smarter, Not Harder
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Our AI-powered platform revolutionizes how you discover Sri Lanka's hidden gems
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            icon: <Brain className="h-8 w-8" />,
            title: "AI-Powered Discovery",
            desc: "Advanced algorithms analyze your preferences to suggest perfect destinations tailored just for you",
            gradient: "from-blue-500 to-cyan-500",
          },
          {
            icon: <Heart className="h-8 w-8" />,
            title: "Interest-Based Matching",
            desc: "Get personalized recommendations based on your unique travel interests and lifestyle preferences",
            gradient: "from-pink-500 to-rose-500",
          },
          {
            icon: <MapPin className="h-8 w-8" />,
            title: "Sri Lanka Expertise",
            desc: "Discover both iconic landmarks and hidden gems across the beautiful Pearl of the Indian Ocean",
            gradient: "from-green-500 to-emerald-500",
          },
          {
            icon: <Sparkles className="h-8 w-8" />,
            title: "Smart Recommendations",
            desc: "Real-time weather data, ratings, and personalized match scores for informed travel decisions",
            gradient: "from-purple-500 to-violet-500",
          },
        ].map((feature, idx) => (
          <div key={idx} className="group">
            <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 h-full border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105">
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-lg`}>
                {feature.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats section */}
      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { number: "1000+", label: "Destinations" },
          { number: "95%", label: "Match Accuracy" },
          { number: "50K+", label: "Happy Travelers" },
          { number: "24/7", label: "AI Support" },
        ].map((stat, idx) => (
          <div key={idx} className="space-y-2">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {stat.number}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
