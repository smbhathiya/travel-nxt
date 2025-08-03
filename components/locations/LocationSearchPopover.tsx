"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, MapPin, Search, X, Compass, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const,
      },
    },
  };

  useEffect(() => {
    const fetchLocations = async () => {
      if (searchQuery.length === 0) {
        setFilteredLocations([]);
        return;
      }

      setIsSearching(true);
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
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchLocations, 300);
    return () => clearTimeout(debounceTimer);
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
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <PopoverTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-start text-left font-normal h-14 bg-card border border-border hover:border-border/60 rounded-2xl px-6 text-base"
                >
                  {searchQuery ? (
                    <span className="flex items-center gap-3">
                      <motion.div
                        className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 rounded-xl"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <MapPin className="h-4 w-4 text-primary" />
                      </motion.div>
                      <span className="font-medium">{searchQuery}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-3 text-muted-foreground">
                      <motion.div
                        className="inline-flex items-center justify-center w-8 h-8 bg-muted rounded-xl"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Compass className="h-4 w-4" />
                      </motion.div>
                      <span>Search for a destination...</span>
                    </span>
                  )}
                </Button>
              </motion.div>
            </PopoverTrigger>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              type="submit" 
              className="h-14 px-8 bg-primary hover:bg-primary/90 rounded-2xl font-semibold"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </motion.div>
        </form>
        
        <PopoverContent
          className="p-0 w-[var(--radix-popover-trigger-width)] bg-card border border-border rounded-2xl shadow-2xl"
          align="start"
          sideOffset={8}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center border-b border-border p-4">
              <motion.div
                className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 rounded-xl mr-3"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Search className="h-4 w-4 text-primary" />
              </motion.div>
              <Input
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a destination..."
                className="border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base font-medium"
                autoFocus
              />
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-xl ml-2"
                    onClick={handleClear}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </div>
            
            <ScrollArea className="h-80">
              <AnimatePresence>
                {isSearching ? (
                  <motion.div 
                    className="flex items-center justify-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-2xl mr-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Search className="h-6 w-6 text-primary" />
                    </motion.div>
                    <span className="text-muted-foreground">Searching...</span>
                  </motion.div>
                ) : filteredLocations.length > 0 ? (
                  <div className="py-2">
                    {filteredLocations.map((location, index) => (
                      <motion.div
                        key={location.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ 
                          backgroundColor: "hsl(var(--muted))",
                          x: 5,
                          transition: { duration: 0.2 }
                        }}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                          searchQuery === location.name && "bg-muted"
                        )}
                        onClick={() => handleLocationSelect(location)}
                      >
                        <motion.div
                          className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 rounded-xl"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <MapPin className="h-4 w-4 text-primary" />
                        </motion.div>
                        <span className="flex-grow font-medium text-foreground">{location.name}</span>
                        {searchQuery === location.name && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center justify-center w-6 h-6 bg-primary rounded-full"
                          >
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : searchQuery.length > 0 ? (
                  <motion.div 
                    className="px-4 py-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-2xl mb-4"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Sparkles className="h-6 w-6 text-muted-foreground" />
                    </motion.div>
                    <p className="text-sm text-muted-foreground mb-2">
                      No locations found
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Try a different search term
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </ScrollArea>
          </motion.div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
