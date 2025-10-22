import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE - Delete a location by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if location exists
    const existingLocation = await prisma.location.findUnique({
      where: { id }
    });

    if (!existingLocation) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    // Delete the location
    await prisma.location.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Location deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting location:', error);
    return NextResponse.json(
      { error: 'Failed to delete location' },
      { status: 500 }
    );
  }
}

// PUT - Update a location by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, type, locatedCity, about, unsplashImage } = body;

    // Check if location exists
    const existingLocation = await prisma.location.findUnique({
      where: { id }
    });

    if (!existingLocation) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    // Update the location
    const updatedLocation = await prisma.location.update({
      where: { id },
      data: {
        name: name || existingLocation.name,
        type: type || existingLocation.type,
        locatedCity: locatedCity || existingLocation.locatedCity,
        about: about || existingLocation.about,
        unsplashImage: unsplashImage || existingLocation.unsplashImage,
      }
    });

    return NextResponse.json(updatedLocation);
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 500 }
    );
  }
} 