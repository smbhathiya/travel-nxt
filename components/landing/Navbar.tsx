"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, Menu, X } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useState } from "react";

export function Navbar() {
  const { isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-6xl mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <span className="text-lg sm:text-xl font-bold">
            Travel<span className="text-primary">Nxt</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        {isSignedIn ? (
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/discover"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Discover
            </Link>
            <Link
              href="/locations"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Find Locations
            </Link>
            <Link
              href="/interests"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              My Interests
            </Link>
            <Link
              href="/bookmarks"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              My Bookmarks
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Profile
            </Link>
          </nav>
        ) : null}

        {/* Right side: Buttons */}
        <div className="flex items-center space-x-4">
          <ModeToggle />

          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button className="hidden sm:flex" size="sm" asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          )}

          {/* Mobile menu button */}
          <button
            className="ml-2 md:hidden p-2 rounded-md hover:bg-muted"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 pt-0 pb-5 border-b bg-background">
          <nav className="flex flex-col space-y-3">
            {isSignedIn ? (
              <>
                <Link
                  href="/discover"
                  className="px-3 py-2 rounded-md hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Discover Sri Lanka
                </Link>
                <Link
                  href="/locations"
                  className="px-3 py-2 rounded-md hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find Locations
                </Link>
                <Link
                  href="/interests"
                  className="px-3 py-2 rounded-md hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Interests
                </Link>
                <Link
                  href="/bookmarks"
                  className="px-3 py-2 rounded-md hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bookmarks
                </Link>
                <Link
                  href="/profile"
                  className="px-3 py-2 rounded-md hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="px-3 py-2 rounded-md hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-3 py-2 rounded-md hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
