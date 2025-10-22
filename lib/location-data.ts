export const availableLocations = [
  'Arugam Bay',
  'Bentota Beach',
  'Hikkaduwa Beach',
  'Jungle Beach',
  'Kalutara Beach',
  'Marble Beach',
  'Mirissa Beach',
  'Mount Lavinia Beach',
  'Negombo Beach',
  'Nilaveli Beach',
  'Passikudah Beach',
  'Gregory Lake',
  'Kandy Lake',
  'Tissa Wewa',
  'Twin Baths (Kuttam Pokuna)',
  'Ambewela Farms',
  'Bluefield Tea Gardens',
  'Dambatenne Tea Factory',
  'Damro Labookellie Tea Centre and Tea Garden',
  'Glenloch Tea Factory',
  'Halpewatte Tea Factory Tour',
  'Handunugoda Tea Estate',
  'Pedro Tea Factory',
  'Brief Garden - Bevis Bawa',
  'Hakgala Botanic Gardens',
  'New Ranweli Spice Garden',
  'Royal Botanical Gardens',
  'Victoria Park of Nuwara Eliya',
  'Galle Fort',
  'Jaffna Fort',
  'Lipton\'s Seat',
  'Polonnaruwa',
  'Ritigala Forest Monastery',
  'Sigiriya The Ancient Rock Fortress',
  'Ariyapala Mask Museum',
  'Ceylon Tea Museum',
  'Colombo National Museum',
  'Community Tsunami Museum',
  'Martin Wickramasinghe Folk Museum Complex',
  'Sigiriya Museum',
  'World Buddhist Museum',
  'Bundala National Park',
  'Horton Plains National Park',
  'Kaudulla National Park',
  'Kumana National Park',
  'Minneriya National Park',
  'Pigeon Island National Park',
  'Udawalawe National Park',
  'Kalametiya Eco Bird Watching',
  'Minneriya Tusker Safaris',
  'Pinnawala Elephant Orphanage',
  'Sea Turtle Farm Galle Mahamodara',
  'Sinharaja Forest Reserve',
  'Udawattekele Sanctuary',
  'Wilpattu National Park',
  'Baker\'s Falls',
  'Diyaluma Falls',
  'Lover\'s Leap Falls',
  'Ramboda Waterfall',
  'Ravana Ella Falls',
  'St Clair\'s Falls',
  'National Zoological Gardens of Sri Lanka',
  'Dagoba of Thuparama',
  'Isurumuniya Temple',
  'Jaya Sri Maha Bodhi',
  'Jethawanaramaya Stupa',
  'Mihintale',
  'Ruwanwelisaya',
  'Abhayagiri Dagaba',
  'Samadhi Statue',
  'Kelaniya Raja Maha Vihara',
  'Gangaramaya (Vihara) Buddhist Temple',
  'Temple of the Sacred Tooth Relic',
  'Dambulla Cave Temple',
  'Koneswaram Temple',
  'Nallur Kovil'
];

export type LocationCategory = {
  type: string;
  locations: string[];
  description: string;
};

export const locationCategories: LocationCategory[] = [
  {
    type: "Beaches",
    locations: [
      'Arugam Bay', 'Bentota Beach', 'Hikkaduwa Beach', 'Jungle Beach', 
      'Kalutara Beach', 'Marble Beach', 'Mirissa Beach', 'Mount Lavinia Beach', 
      'Negombo Beach', 'Nilaveli Beach', 'Passikudah Beach'
    ],
    description: "Discover pristine sandy beaches and crystal-clear waters perfect for swimming, surfing, and relaxation."
  },
  {
    type: "Lakes",
    locations: ['Gregory Lake', 'Kandy Lake', 'Tissa Wewa', 'Twin Baths (Kuttam Pokuna)'],
    description: "Serene bodies of water surrounded by natural beauty and perfect for peaceful recreation."
  },
  {
    type: "Farms & Tea Estates",
    locations: [
      'Ambewela Farms', 'Bluefield Tea Gardens', 'Dambatenne Tea Factory',
      'Damro Labookellie Tea Centre and Tea Garden', 'Glenloch Tea Factory',
      'Halpewatte Tea Factory Tour', 'Handunugoda Tea Estate', 'Pedro Tea Factory'
    ],
    description: "Explore Sri Lanka's famous tea culture and agricultural heritage with visits to working tea estates and farms."
  },
  {
    type: "Gardens",
    locations: [
      'Brief Garden - Bevis Bawa', 'Hakgala Botanic Gardens',
      'New Ranweli Spice Garden', 'Royal Botanical Gardens',
      'Victoria Park of Nuwara Eliya'
    ],
    description: "Beautiful botanical gardens showcasing the rich diversity of Sri Lankan flora."
  },
  {
    type: "Historic Sites",
    locations: [
      'Galle Fort', 'Jaffna Fort', 'Lipton\'s Seat',
      'Polonnaruwa', 'Ritigala Forest Monastery',
      'Sigiriya The Ancient Rock Fortress'
    ],
    description: "Ancient ruins, forts, and monuments that tell the rich history of Sri Lanka."
  },
  {
    type: "Museums",
    locations: [
      'Ariyapala Mask Museum', 'Ceylon Tea Museum', 'Colombo National Museum',
      'Community Tsunami Museum', 'Martin Wickramasinghe Folk Museum Complex',
      'Sigiriya Museum', 'World Buddhist Museum'
    ],
    description: "Cultural and historical exhibits showcasing Sri Lanka's heritage and artistic traditions."
  },
  {
    type: "National Parks",
    locations: [
      'Bundala National Park', 'Horton Plains National Park', 'Kaudulla National Park',
      'Kumana National Park', 'Minneriya National Park', 'Pigeon Island National Park',
      'Udawalawe National Park'
    ],
    description: "Protected natural areas with diverse ecosystems and abundant wildlife."
  },
  {
    type: "Wildlife Areas",
    locations: [
      'Kalametiya Eco Bird Watching', 'Minneriya Tusker Safaris',
      'Pinnawala Elephant Orphanage', 'Sea Turtle Farm Galle Mahamodara',
      'Sinharaja Forest Reserve', 'Udawattekele Sanctuary', 'Wilpattu National Park',
      'National Zoological Gardens of Sri Lanka'
    ],
    description: "Sanctuaries and reserves dedicated to the conservation and observation of Sri Lanka's diverse wildlife."
  },
  {
    type: "Waterfalls",
    locations: [
      'Baker\'s Falls', 'Diyaluma Falls', 'Lover\'s Leap Falls',
      'Ramboda Waterfall', 'Ravana Ella Falls', 'St Clair\'s Falls'
    ],
    description: "Stunning natural waterfalls set among Sri Lanka's mountainous regions."
  },
  {
    type: "Temples",
    locations: [
      'Dagoba of Thuparama', 'Isurumuniya Temple', 'Jaya Sri Maha Bodhi',
      'Jethawanaramaya Stupa', 'Mihintale', 'Ruwanwelisaya',
      'Abhayagiri Dagaba', 'Samadhi Statue', 'Kelaniya Raja Maha Vihara',
      'Gangaramaya (Vihara) Buddhist Temple', 'Temple of the Sacred Tooth Relic',
      'Dambulla Cave Temple', 'Koneswaram Temple', 'Nallur Kovil'
    ],
    description: "Sacred religious sites representing Buddhism, Hinduism, and other faiths important to Sri Lanka's culture."
  }
];

export const getLocationCategory = (locationName: string): string | null => {
  for (const category of locationCategories) {
    if (category.locations.includes(locationName)) {
      return category.type;
    }
  }
  return null;
};

export const getRelatedLocations = (locationName: string, limit = 5): string[] => {
  const category = getLocationCategory(locationName);
  if (!category) return [];
  
  const categoryLocations = locationCategories.find(c => c.type === category)?.locations || [];
  
  return categoryLocations
    .filter(name => name !== locationName)
    .sort(() => Math.random() - 0.5) // Shuffle for variety
    .slice(0, limit);
};

export const getAllCategoriesWithCounts = () => {
  return locationCategories.map(category => ({
    type: category.type,
    count: category.locations.length,
    description: category.description
  }));
};

export const searchLocations = (query: string): string[] => {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  
  return availableLocations.filter(location => 
    location.toLowerCase().includes(lowerQuery)
  ).sort((a, b) => {
    // Sort by how closely the location name matches the query
    const aStartsWith = a.toLowerCase().startsWith(lowerQuery);
    const bStartsWith = b.toLowerCase().startsWith(lowerQuery);
    
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    return a.localeCompare(b);
  }).slice(0, 10);
};
