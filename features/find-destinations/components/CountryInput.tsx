import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import React from "react";

interface CountryInputProps {
  country: string;
  setCountry: (val: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (val: boolean) => void;
  countrySuggestions: { name: string; code: string }[];
}

export function CountryInput({
  country,
  setCountry,
  showSuggestions,
  setShowSuggestions,
  countrySuggestions,
}: CountryInputProps) {
  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        id="country"
        placeholder="Enter a country or region"
        className="pl-10"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        onFocus={() => country.length > 0 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        autoComplete="off"
        required
      />
      {showSuggestions && countrySuggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-muted rounded-md shadow-lg z-20 max-h-56 overflow-auto">
          {countrySuggestions.map((suggestion) => (
            <div
              key={suggestion.code}
              className="px-4 py-2 cursor-pointer hover:bg-muted text-sm"
              onMouseDown={() => {
                setCountry(suggestion.name);
                setShowSuggestions(false);
              }}
            >
              {suggestion.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
