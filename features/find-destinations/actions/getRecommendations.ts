import { Recommendation } from "../../find-destinations/types";
import { Sun, Cloud, CloudRain, Droplets } from "lucide-react";

// Note: The 'icon' property is now a component reference, not JSX. Render as <Icon className="..." /> in your UI.

export async function getRecommendations(): Promise<Recommendation[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return [
    {
      id: 1,
      name: "Kyoto",
      country: "Japan",
      description:
        "Historical temples, traditional gardens, and authentic cultural experiences perfect for culture enthusiasts.",
      matchScore: 98,
      image: "/landing/landing-01.jpg",
      category: "Cultural",
      weatherForecasts: [
        {
          month: "June",
          averageTemp: 28,
          precipitation: 13,
          icon: Sun,
          conditions: "Warm & Humid",
        },
        {
          month: "July",
          averageTemp: 32,
          precipitation: 18,
          icon: Cloud,
          conditions: "Hot & Humid",
        },
        {
          month: "August",
          averageTemp: 33,
          precipitation: 14,
          icon: CloudRain,
          conditions: "Hot with Showers",
        },
      ],
    },
    {
      id: 2,
      name: "Barcelona",
      country: "Spain",
      description:
        "Stunning architecture, vibrant streets, and beautiful beaches, ideal for urban explorers.",
      matchScore: 95,
      image: "/landing/landing-01.jpg",
      category: "Urban",
      weatherForecasts: [
        {
          month: "June",
          averageTemp: 26,
          precipitation: 4,
          icon: Sun,
          conditions: "Warm & Sunny",
        },
        {
          month: "July",
          averageTemp: 29,
          precipitation: 2,
          icon: Sun,
          conditions: "Hot & Dry",
        },
        {
          month: "August",
          averageTemp: 30,
          precipitation: 5,
          icon: Sun,
          conditions: "Hot & Sunny",
        },
      ],
    },
    {
      id: 3,
      name: "Costa Rica",
      country: "Costa Rica",
      description:
        "Lush rainforests, diverse wildlife, and incredible hiking opportunities for nature lovers.",
      matchScore: 91,
      image: "/landing/landing-01.jpg",
      category: "Nature",
      weatherForecasts: [
        {
          month: "June",
          averageTemp: 26,
          precipitation: 28,
          icon: Droplets,
          conditions: "Warm & Rainy",
        },
        {
          month: "July",
          averageTemp: 26,
          precipitation: 25,
          icon: Droplets,
          conditions: "Warm & Rainy",
        },
        {
          month: "August",
          averageTemp: 26,
          precipitation: 26,
          icon: Droplets,
          conditions: "Warm & Rainy",
        },
      ],
    },
    {
      id: 4,
      name: "Santorini",
      country: "Greece",
      description:
        "Breathtaking views, white-washed buildings, and stunning sunsets perfect for couples and photographers.",
      matchScore: 88,
      image: "/landing/landing-01.jpg",
      category: "Island",
      weatherForecasts: [
        {
          month: "June",
          averageTemp: 26,
          precipitation: 1,
          icon: Sun,
          conditions: "Warm & Dry",
        },
        {
          month: "July",
          averageTemp: 27,
          precipitation: 0,
          icon: Sun,
          conditions: "Hot & Dry",
        },
        {
          month: "August",
          averageTemp: 28,
          precipitation: 0,
          icon: Sun,
          conditions: "Hot & Dry",
        },
      ],
    },
    {
      id: 5,
      name: "Queenstown",
      country: "New Zealand",
      description:
        "Adventure capital with stunning alpine scenery, perfect for outdoor enthusiasts.",
      matchScore: 85,
      image: "/landing/landing-01.jpg",
      category: "Mountains",
      weatherForecasts: [
        {
          month: "June",
          averageTemp: 5,
          precipitation: 70,
          icon: CloudRain,
          conditions: "Cold & Wet",
        },
        {
          month: "July",
          averageTemp: 4,
          precipitation: 65,
          icon: CloudRain,
          conditions: "Cold & Wet",
        },
        {
          month: "August",
          averageTemp: 6,
          precipitation: 60,
          icon: Cloud,
          conditions: "Cold",
        },
      ],
    },
  ];
}
