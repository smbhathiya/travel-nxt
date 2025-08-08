'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export interface TopRatedLocation {
  id: string;
  name: string;
  type: string;
  locatedCity: string;
  about: string;
  overallRating: number;
  unsplashImage: string;
  _count?: {
    feedbacks: number;
  };
}

export async function getTopRatedLocations(limit: number = 6): Promise<TopRatedLocation[]> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const topRatedLocations = await prisma.location.findMany({
      where: {
        overallRating: {
          gt: 0, // Only get locations with ratings
        },
      },
      orderBy: {
        overallRating: 'desc',
      },
      take: limit,
      include: {
        _count: {
          select: {
            feedbacks: true,
          },
        },
      },
    });

    return topRatedLocations;
  } catch (error) {
    console.error('Error fetching top rated locations from database:', error);
    throw new Error('Failed to fetch top rated locations');
  }
}

export async function getTopRatedLocationsByCategory(
  category: string,
  limit: number = 6
): Promise<TopRatedLocation[]> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const topRatedLocations = await prisma.location.findMany({
      where: {
        type: category,
        overallRating: {
          gt: 0,
        },
      },
      orderBy: {
        overallRating: 'desc',
      },
      take: limit,
      include: {
        _count: {
          select: {
            feedbacks: true,
          },
        },
      },
    });

    return topRatedLocations;
  } catch (error) {
    console.error(`Error fetching top rated ${category} locations from database:`, error);
    throw new Error(`Failed to fetch top rated ${category} locations`);
  }
}

export async function getTopRatedLocationsWithMinFeedback(
  minFeedbackCount: number = 1,
  limit: number = 6
): Promise<TopRatedLocation[]> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const allTopRatedLocations = await prisma.location.findMany({
      where: {
        overallRating: {
          gt: 0,
        },
        feedbacks: {
          some: {},
        },
      },
      orderBy: {
        overallRating: 'desc',
      },
      include: {
        _count: {
          select: {
            feedbacks: true,
          },
        },
      },
    });

    // Filter by minimum feedback count and apply limit
    const topRatedLocations = allTopRatedLocations
      .filter(location => (location._count?.feedbacks || 0) >= minFeedbackCount)
      .slice(0, limit);

    return topRatedLocations;
  } catch (error) {
    console.error('Error fetching top rated locations with minimum feedback from database:', error);
    throw new Error('Failed to fetch top rated locations with minimum feedback');
  }
}

export async function getTopRatedLocationsByCity(
  city: string,
  limit: number = 6
): Promise<TopRatedLocation[]> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const topRatedLocations = await prisma.location.findMany({
      where: {
        locatedCity: {
          contains: city,
          mode: 'insensitive', // Case-insensitive search
        },
        overallRating: {
          gt: 0,
        },
      },
      orderBy: {
        overallRating: 'desc',
      },
      take: limit,
      include: {
        _count: {
          select: {
            feedbacks: true,
          },
        },
      },
    });

    return topRatedLocations;
  } catch (error) {
    console.error(`Error fetching top rated locations in ${city} from database:`, error);
    throw new Error(`Failed to fetch top rated locations in ${city}`);
  }
} 