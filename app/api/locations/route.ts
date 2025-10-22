import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all locations
export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

// POST - Create a new location
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, locatedCity, about, unsplashImage } = body;

    // Validate required fields
    if (!name || !type || !locatedCity || !about) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, locatedCity, about' },
        { status: 400 }
      );
    }

    // Check if location already exists
    const existingLocation = await prisma.location.findFirst({
      where: {
        name: name,
        locatedCity: locatedCity
      }
    });

    if (existingLocation) {
      return NextResponse.json(
        { error: 'Location already exists in this city' },
        { status: 409 }
      );
    }

    // Create new location
    const newLocation = await prisma.location.create({
      data: {
        name,
        type,
        locatedCity,
        about,
        unsplashImage: unsplashImage || '',
        overallRating: 0
      }
    });

    return NextResponse.json(newLocation, { status: 201 });
  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    );
  }
} 