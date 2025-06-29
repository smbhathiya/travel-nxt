import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

type Testimonial = {
  text: string;
  author: string;
  role: string;
  initials: string;
};

export function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      text: "The AI recommendations were spot-on! It suggested a beach destination I'd never considered but matched my interests perfectly. Even predicted great weather for my visit.",
      author: "Sarah Johnson",
      role: "Beach Lover",
      initials: "SJ",
    },
    {
      text: "As a hiking enthusiast, I was amazed how the app considered my previous mountain trips and suggested new trails that matched my experience level. The weather forecast feature was invaluable.",
      author: "Michael Torres",
      role: "Hiking Enthusiast",
      initials: "MT",
    },
    {
      text: "I entered my interest in cultural experiences and historical sites, and the AI suggested destinations that perfectly aligned with my tastes. I discovered hidden gems I wouldn't have found otherwise.",
      author: "Emma Chen",
      role: "Culture Explorer",
      initials: "EC",
    },
  ];

  return (
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
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-card border-none shadow-sm mx-auto w-full max-w-sm sm:max-w-none"
            >
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
                  &quot;{testimonial.text}&quot;
                </p>
                <div className="mt-6 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-medium text-primary">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
