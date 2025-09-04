import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient, Prisma } from '@/lib/generated/prisma';

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
  const { locationId, locationName, locatedCity, locationType } = body;
  // Coerce numeric fields and provide safe defaults
  const rating = Number(body.rating ?? 0);
  const personalizedScore = Number(body.personalizedScore ?? 0);

  // Basic validation for required text fields
  if (!locationName || !locatedCity || !locationType) {
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

    // Create bookmark
      // Build data object and include locationId when provided.
      // We temporarily disable the explicit-any lint rule here because the Prisma client
      // types need to be regenerated after schema changes (`npx prisma generate`).
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

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user record
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
