"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export interface UpdateUserProfileData {
  name?: string;
  email?: string;
  introduction?: string;
}

export async function updateUserProfile(data: UpdateUserProfileData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    console.log('🔄 [Profile] Updating user profile:', { userId, data });

    // Update in database
    const updatedUser = await prisma.user.upsert({
      where: { clerkUserId: userId },
      update: {
        name: data.name,
        email: data.email,
        introduction: data.introduction,
        updatedAt: new Date(),
      },
      create: {
        clerkUserId: userId,
        name: data.name || "",
        email: data.email || "",
        introduction: data.introduction || "",
        interests: [],
      },
    });

    console.log('✅ [Profile] Database updated successfully:', updatedUser);

    // Note: Clerk user data updates would typically be done through their API
    // For now, we'll return the updated database record
    // In a production app, you'd also call Clerk's API to update user metadata

    return {
      success: true,
      user: updatedUser,
      message: "Profile updated successfully"
    };

  } catch (error) {
    console.error('❌ [Profile] Error updating profile:', error);
    throw new Error(error instanceof Error ? error.message : "Failed to update profile");
  }
}

export async function getUserProfile() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    console.log('🔄 [Profile] Fetching user profile:', { userId });

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        clerkUserId: true,
        name: true,
        email: true,
        introduction: true,
        interests: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log('✅ [Profile] User profile fetched:', user);

    return {
      success: true,
      user: user || null,
    };

  } catch (error) {
    console.error('❌ [Profile] Error fetching profile:', error);
    throw new Error(error instanceof Error ? error.message : "Failed to fetch profile");
  }
} 