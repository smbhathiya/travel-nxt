export { 
  getTopRatedLocations,
  getTopRatedLocationsByCategory,
  getTopRatedLocationsWithMinFeedback,
  getTopRatedLocationsByCity,
  type TopRatedLocation
} from "./getTopRatedLocations";
export { getPersonalizedRecommendations } from "./getPersonalizedRecommendations";
export { updateUserProfile, getUserProfile } from "./updateUserProfile";

export type { PersonalizedRecommendation, PredictedInterest } from "./getPersonalizedRecommendations";
export type { UpdateUserProfileData } from "./updateUserProfile"; 