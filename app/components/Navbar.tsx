import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-6xl mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <span className="text-lg sm:text-xl font-bold">Smart<span className="text-primary">Traveller</span></span>
        </Link>
        {/* Right side: Theme switcher and Sign In */}
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button variant="outline">Sign In</Button>
        </div>
      </div>
    </header>
  );
}
