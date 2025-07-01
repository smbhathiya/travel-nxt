"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, MapPin, Search, X } from "lucide-react";
import { availableLocations } from "@/lib/location-data";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface LocationSearchPopoverProps {
  className?: string;
}

export function LocationSearchPopover({ className }: LocationSearchPopoverProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Filter locations synchronously without creating promises
    if (searchQuery.length > 0) {
      const filtered = availableLocations.filter(location => 
        location.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 20); // Limit to 20 results for better performance
      setFilteredLocations(filtered);
    } else {
      // Show a few example locations when no search is entered
      setFilteredLocations(availableLocations.slice(0, 10));
    }
  }, [searchQuery]);

  const handleLocationSelect = (location: string) => {
    setSearchQuery(location);
    setOpen(false);
    // Use replace instead of push to avoid adding to history stack
    // This can sometimes help with navigation-related suspense issues
    router.replace(`/locations/${encodeURIComponent(location)}`);
  };

  const handleClear = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only navigate if we have a valid location from our predefined list
    if (searchQuery && availableLocations.includes(searchQuery)) {
      // Close popover first to avoid state updates after navigation
      setOpen(false);
      // Use a setTimeout to delay navigation slightly, allowing React to finish any pending state updates
      setTimeout(() => {
        router.replace(`/locations/${encodeURIComponent(searchQuery)}`);
      }, 0);
    }
  };

  // Handle any errors safely
  const safelyHandleChange = (newOpen: boolean) => {
    try {
      setOpen(newOpen);
    } catch (error) {
      console.error("Error updating popover state:", error);
    }
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <Popover open={open} onOpenChange={safelyHandleChange}>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                role="combobox"
                className="w-full justify-start text-left font-normal h-11"
              >
                {searchQuery ? (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {searchQuery}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Search for a destination...</span>
                )}
              </Button>
            </PopoverTrigger>
          </div>
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
        <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
          <div className="flex items-center border-b p-3">
            <Search className="h-4 w-4 mr-2 flex-none text-muted-foreground" />
            <Input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a destination..."
              className="border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 rounded-full"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <ScrollArea className="h-72">
            {filteredLocations.length > 0 ? (
              <div className="py-2">
                {filteredLocations.map((location, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-muted transition-colors",
                      searchQuery === location && "bg-muted"
                    )}
                    onClick={() => handleLocationSelect(location)}
                  >
                    <MapPin className="h-4 w-4 flex-none" />
                    <span className="flex-grow">{location}</span>
                    {searchQuery === location && <Check className="h-4 w-4 text-primary" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No locations found. Try a different search.
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
