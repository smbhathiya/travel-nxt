"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, MapPin, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Location {
  id: string;
  name: string;
}

interface LocationSearchPopoverProps {
  className?: string;
}

export function LocationSearchPopover({
  className,
}: LocationSearchPopoverProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(
          `/api/locations/search?q=${encodeURIComponent(searchQuery)}`
        );
        if (res.ok) {
          const data = await res.json();
          setFilteredLocations(data);
        } else {
          setFilteredLocations([]);
        }
      } catch {
        setFilteredLocations([]);
      }
    };
    if (searchQuery.length > 0) {
      fetchLocations();
    } else {
      setFilteredLocations([]);
    }
  }, [searchQuery]);

  const handleLocationSelect = (location: Location) => {
    setSearchQuery(location.name);
    setOpen(false);
    router.replace(`/locations/${location.id}`);
  };

  const handleClear = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery && filteredLocations.length > 0) {
      setOpen(false);
      setTimeout(() => {
        router.replace(`/locations/${filteredLocations[0].id}`);
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
                  <span className="text-muted-foreground">
                    Search for a destination...
                  </span>
                )}
              </Button>
            </PopoverTrigger>
          </div>
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
        <PopoverContent
          className="p-0 w-[var(--radix-popover-trigger-width)]"
          align="start"
        >
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
                {filteredLocations.map((location) => (
                  <div
                    key={location.id}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-muted transition-colors",
                      searchQuery === location.name && "bg-muted"
                    )}
                    onClick={() => handleLocationSelect(location)}
                  >
                    <MapPin className="h-4 w-4 flex-none" />
                    <span className="flex-grow">{location.name}</span>
                    {searchQuery === location.name && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
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
