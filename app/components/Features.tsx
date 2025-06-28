import { Compass, Sun, Map } from "lucide-react";

export function Features() {
  return (
    <div className="container max-w-6xl mx-auto">
      <div className="mt-16 sm:mt-20 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-10 px-4">
        {[
          {
            icon: <Compass className="h-8 w-8 text-primary" />,
            title: "AI-Powered Discovery",
            desc: "Our advanced AI analyzes your interests to suggest the best destinations in Sri Lanka for you",
          },
          {
            icon: <Sun className="h-8 w-8 text-primary" />,
            title: "Interest-Based Matching",
            desc: "Get personalized recommendations based on your specific travel interests and preferences",
          },
          {
            icon: <Map className="h-8 w-8 text-primary" />,
            title: "Sri Lanka Expertise",
            desc: "Discover hidden gems and popular destinations across the beautiful island of Sri Lanka",
          },
        ].map((feature, idx) => (
          <div key={idx} className="relative group h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-card rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow flex flex-col items-center h-[340px] w-full min-w-[260px] max-w-[350px] mx-auto">
              <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 w-16 h-16 mb-6 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-center flex-1 flex items-center justify-center">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
