import { useState, useEffect } from "react";

export function useCountrySuggestions(country: string) {
  const [countrySuggestions, setCountrySuggestions] = useState<
    { name: string; code: string }[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (country.length > 0) {
      fetch(`https://restcountries.com/v3.1/name/${country}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data)) {
            setCountrySuggestions(
              data.map((country: any) => ({
                name: country.name.common,
                code: country.cca2,
              }))
            );
          } else {
            setCountrySuggestions([]);
          }
        });
      setShowSuggestions(true);
    } else {
      setCountrySuggestions([]);
      setShowSuggestions(false);
    }
  }, [country]);

  return { countrySuggestions, showSuggestions, setShowSuggestions };
}
