// 'use client';

// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Star, MapPin, Brain, Sparkles, Loader2 } from 'lucide-react';
// import { 
//   getPersonalizedRecommendations, 
//   getFallbackRecommendations,
//   type PersonalizedRecommendation,
//   type PredictedInterest 
// } from '../actions';

// export function PersonalizedRecommendationsDemo() {
//   const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
//   const [predictedInterests, setPredictedInterests] = useState<PredictedInterest[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [usingAI, setUsingAI] = useState(false);

//   const fetchPersonalizedRecommendations = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Try AI-powered recommendations first
//       try {
//         const data = await getPersonalizedRecommendations();
//         setRecommendations(data.recommendations);
//         setPredictedInterests(data.predictedInterests);
//         setUsingAI(true);
//       } catch (predictionError) {
//         console.warn("AI prediction failed, using fallback:", predictionError);
        
//         // Fallback to user interests
//         const fallbackData = await getFallbackRecommendations();
//         setRecommendations(fallbackData);
//         setPredictedInterests([]);
//         setUsingAI(false);
//       }
//     } catch (err) {
//       setError('Failed to fetch personalized recommendations');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Brain className="h-5 w-5 text-purple-500" />
//             AI-Powered Personalized Recommendations
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex flex-wrap gap-2">
//             <Button 
//               onClick={fetchPersonalizedRecommendations} 
//               disabled={loading}
//               className="flex items-center gap-2"
//             >
//               {loading ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <Brain className="h-4 w-4" />
//               )}
//               Get AI Recommendations
//             </Button>
//           </div>

//           {error && (
//             <div className="text-red-500 text-sm">{error}</div>
//           )}

//           {usingAI && predictedInterests.length > 0 && (
//             <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
//               <div className="flex items-center gap-2 mb-3">
//                 <Brain className="h-4 w-4 text-purple-600" />
//                 <span className="font-medium text-purple-700 dark:text-purple-300">
//                   AI Predicted Interests
//                 </span>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {predictedInterests.map((interest, idx) => (
//                   <Badge key={idx} variant="secondary" className="flex items-center gap-1">
//                     <Sparkles className="h-3 w-3" />
//                     {interest.location_type}
//                     <span className="text-xs opacity-75">
//                       ({Math.round(interest.confidence * 100)}%)
//                     </span>
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}

//           {loading && (
//             <div className="text-center py-8">
//               <Loader2 className="h-8 w-8 mx-auto animate-spin text-purple-500 mb-2" />
//               <p className="text-sm text-muted-foreground">
//                 {usingAI 
//                   ? "Analyzing your profile and predicting interests..."
//                   : "Getting personalized recommendations..."
//                 }
//               </p>
//             </div>
//           )}

//           {!loading && recommendations.length > 0 && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {recommendations.map((location, index) => (
//                 <Card key={index} className="overflow-hidden">
//                   <CardContent className="p-4">
//                     <div className="flex items-start justify-between mb-2">
//                       <h3 className="font-semibold text-lg">{location.Location_Name}</h3>
//                       <div className="flex items-center gap-1">
//                         <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                         <span className="text-sm font-medium">
//                           {location.Rating.toFixed(1)}
//                         </span>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-1 mb-2">
//                       <MapPin className="h-4 w-4 text-muted-foreground" />
//                       <span className="text-sm text-muted-foreground">
//                         {location.Located_City}
//                       </span>
//                     </div>

//                     <Badge variant="secondary" className="mb-2">
//                       {location.Location_Type}
//                     </Badge>

//                     {location.reviewCount > 0 && (
//                       <div className="text-xs text-muted-foreground mb-2">
//                         {location.reviewCount} reviews
//                       </div>
//                     )}

//                     <div className="text-xs text-muted-foreground">
//                       Sentiment Score: {(location.Sentiment_Score * 100).toFixed(0)}%
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}

//           {!loading && recommendations.length === 0 && !error && (
//             <div className="text-center py-8 text-muted-foreground">
//               Click the button above to get your personalized recommendations.
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// } 