"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Star,
  Loader2,
  Trash2,
  ExternalLink,
  Bookmark,
} from "lucide-react";
import { Navbar } from "../../components/landing/Navbar";
import { Footer } from "../../components/landing/Footer";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

interface BookmarkData {
  id: string;
  locationName: string;
  locatedCity: string;
  locationType: string;
  rating: number;
  personalizedScore: number; // This is now Sentiment_Score from the API
  createdAt: string;
}

export default function BookmarksPage() {
  const { user } = useUser();
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<Set<string>>(new Set());

  const fetchBookmarks = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/bookmarks");
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data.bookmarks);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user, fetchBookmarks]);

  const handleDeleteBookmark = async (bookmark: BookmarkData) => {
    if (!user) return;

    setDeleteLoading((prev) => new Set(prev).add(bookmark.id));

    try {
      const response = await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locationName: bookmark.locationName,
          locatedCity: bookmark.locatedCity,
        }),
      });

      if (response.ok) {
        setBookmarks((prev) => prev.filter((b) => b.id !== bookmark.id));
      }
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    } finally {
      setDeleteLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookmark.id);
        return newSet;
      });
    }
  };

  const handleViewMore = (bookmark: BookmarkData) => {
    const searchQuery = `${bookmark.locationName} ${bookmark.locatedCity} Sri Lanka tourist attractions`;
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      searchQuery
    )}`;
    window.open(googleSearchUrl, "_blank", "noopener,noreferrer");
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                Please sign in to view your bookmarks.
              </p>
              <Button asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              My Bookmarks
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your saved destinations for future adventures
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Loading your bookmarks...
              </span>
            </div>
          ) : bookmarks.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6 text-center">
                <Bookmark className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start exploring destinations and bookmark the ones you&apos;d
                  like to visit.
                </p>
                <Button asChild>
                  <a href="/discover">Discover Locations</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((bookmark) => (
                <Card
                  key={bookmark.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl leading-tight mb-2 text-foreground">
                          {bookmark.locationName}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="h-5 w-5" />
                          <span className="text-base font-medium text-muted-foreground">
                            {bookmark.locatedCity}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {/* Rating */}
                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">
                            {bookmark.rating.toFixed(1)}
                          </span>
                        </div>
                        {/* Match Score */}
                        <div className="flex items-center gap-1 bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded-full">
                          <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-xs font-bold text-primary-foreground">
                              %
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-primary">
                            {(bookmark.personalizedScore * 100).toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Location type */}
                    <div className="mb-4">
                      <span className="inline-block bg-secondary/50 text-secondary-foreground text-sm font-medium px-3 py-1 rounded-full capitalize">
                        {bookmark.locationType}
                      </span>
                    </div>

                    {/* Bookmarked date */}
                    <div className="mb-4 text-xs text-muted-foreground">
                      Bookmarked on{" "}
                      {new Date(bookmark.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleViewMore(bookmark)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        More Info
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteBookmark(bookmark)}
                        disabled={deleteLoading.has(bookmark.id)}
                      >
                        {deleteLoading.has(bookmark.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
