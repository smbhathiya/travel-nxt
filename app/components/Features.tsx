import { Compass, Sun, Map } from "lucide-react";

export function Features() {
  return (
    <div className="container max-w-6xl mx-auto">
      <div className="mt-16 sm:mt-20 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-10 px-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative bg-card rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow">
            <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 w-16 h-16 mb-6 flex items-center justify-center">
              <Compass className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI-Powered Discovery</h3>
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
            <h3 className="text-xl font-semibold mb-3">Weather Forecasting</h3>
            <p className="text-muted-foreground">
              Get insights on upcoming weather conditions to plan the perfect
              trip timing
            </p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative bg-card rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow">
            <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 w-16 h-16 mb-6 flex items-center justify-center">
              <Map className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Personalized Matches</h3>
            <p className="text-muted-foreground">
              Discover destinations that match your unique preferences and
              travel style
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
