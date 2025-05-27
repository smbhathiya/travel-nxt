import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, Menu, Search } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">      <div className="container max-w-6xl mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <span className="text-lg sm:text-xl font-bold">Smart<span className="text-primary">Traveller</span></span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/destinations" className="text-sm font-medium transition-colors hover:text-primary">
            Destinations
          </Link>
          <Link href="/guides" className="text-sm font-medium transition-colors hover:text-primary">
            Travel Guides
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
            About Us
          </Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
            Contact
          </Link>
        </nav>        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <ModeToggle />
          <Button className="rounded-full">
            Get Started
          </Button>
          <Button variant="outline" size="icon" className="md:hidden rounded-full">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
