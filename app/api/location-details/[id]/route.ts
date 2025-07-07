import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'Location id is required' },
        { status: 400 }
      );
    }

    const location = await prisma.location.findUnique({
      where: { id },
      include: { feedbacks: true },
    });

    if (!location) {
      return NextResponse.json(
        { error: 'No details found for this location' },
        { status: 404 }
      );
    }

    return NextResponse.json(location);
  } catch (error) {
    console.error('Error fetching location details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch location details. Please try again later.' },
      { status: 500 }
    );
  }
}
