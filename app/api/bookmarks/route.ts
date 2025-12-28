import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

  const body = await request.json();
  console.log('🔔 [Bookmarks API] POST body:', body);
  type BookmarkRequest = {
    locationId?: string;
    rating?: unknown;
    personalizedScore?: unknown;
    locationName?: string;
    locatedCity?: string;
    locationType?: string;
  };

  const parsedBody = body as BookmarkRequest;
  const { locationId } = parsedBody;
  // We'll allow these to be reassigned if we resolve them from the DB
  let locationName = parsedBody.locationName;
  let locatedCity = parsedBody.locatedCity;
  let locationType = parsedBody.locationType;

  // Coerce numeric fields and provide safe defaults
  const rating = Number(body.rating ?? 0);
  const personalizedScore = Number(body.personalizedScore ?? 0);

  // If client only provided locationId, resolve name/city/type from the Locations table
  if (!locationName || !locatedCity || !locationType) {
    console.log('🔔 [Bookmarks API] missing text fields, attempting to resolve from locationId:', locationId);
    if (locationId) {
      const loc = await prisma.location.findUnique({ where: { id: locationId } });
      console.log('🔔 [Bookmarks API] resolved location from DB:', loc);
      if (!loc) {
        return NextResponse.json({ error: 'Location not found for provided locationId' }, { status: 404 });
      }
      locationName = loc.name;
      locatedCity = loc.locatedCity;
      locationType = loc.type;
    }
  }

  // Final validation: we need at least the three text fields to create a bookmark
  if (!locationName || !locatedCity || !locationType) {
    console.warn('🔔 [Bookmarks API] final validation failed - fields:', { locationId, locationName, locatedCity, locationType });
    return NextResponse.json({ error: 'Missing required bookmark fields' }, { status: 400 });
  }

    // Get the user record
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createData: any = {
        userId: user.id,
        locationName,
        locatedCity,
        locationType,
        rating,
        personalizedScore,
      };
      if (locationId) createData.locationId = locationId;

  console.log('🔔 [Bookmarks API] creating bookmark with data:', createData);
  const bookmark = await prisma.bookmark.create({ data: createData });

    return NextResponse.json({ success: true, bookmark });
  } catch (error: unknown) {
    console.error('Error creating bookmark:', error);

    // Handle Prisma unique constraint error cleanly
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Location already bookmarked' }, { status: 409 });
      }
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const locationId = url.searchParams.get('locationId');

    // If caller asked for a specific locationId, return whether it's bookmarked
    if (locationId) {
      const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const bookmark = await prisma.bookmark.findFirst({
        where: { userId: user.id, locationId }
      });

      return NextResponse.json({ bookmarked: !!bookmark, bookmark });
    }

    // Fallback: return all bookmarks for the user
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        bookmarks: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ bookmarks: user.bookmarks });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

  const body = await request.json();
  const { id, locationId, locationName, locatedCity } = body;

    // Get the user record
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete bookmark by id if provided, otherwise by user + locationId or user + name+city
    // Build where clause; use explicit any until Prisma client is regenerated.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = { userId: user.id };
    if (id) whereClause.id = id;
    else if (locationId) whereClause.locationId = locationId;
    else { whereClause.locationName = locationName; whereClause.locatedCity = locatedCity; }

    await prisma.bookmark.deleteMany({ where: whereClause });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
