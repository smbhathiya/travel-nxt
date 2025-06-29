import Link from "next/link";
import { Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container max-w-6xl mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="text-lg sm:text-xl font-bold">
                Smart<span className="text-primary">Traveller</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-[280px]">
              AI-powered travel recommendations based on your interests,
              previous destinations, and optimal weather conditions.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Discover</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/interests"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Travel Interests
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Top Destinations
                </Link>
              </li>
              <li>
                <Link
                  href="/recommendations"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  AI Recommendations
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} SmartTraveller. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
