"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  profileImage?: string;
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
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        bio: data.bio,
        profileImage: data.profileImage,
        updatedAt: new Date(),
      },
      create: {
        clerkUserId: userId,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        bio: data.bio || "",
        profileImage: data.profileImage || "",
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
        firstName: true,
        lastName: true,
        email: true,
        bio: true,
        profileImage: true,
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