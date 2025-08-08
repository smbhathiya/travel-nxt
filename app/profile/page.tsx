"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { getUserProfile, updateUserProfile, UpdateUserProfileData } from "@/features/find-destinations/actions";
import { Navbar } from "@/components/landing/Navbar";
import { 
  User, 
  Mail, 
  FileText, 
  Edit3, 
  Save, 
  X, 
  Bookmark, 
  Heart,
  Calendar,
  Clock
} from "lucide-react";
import Image from "next/image";

interface UserProfile {
  id: string;
  clerkUserId: string;
  name: string;
  email: string;
  introduction: string;
  interests: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<UpdateUserProfileData>({
    name: "",
    email: "",
    introduction: "",
  });
  const [dbProfile, setDbProfile] = useState<UserProfile | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const result = await getUserProfile();
      if (result.success && result.user) {
        setDbProfile(result.user);
        // Update form with database data
        setProfileData({
          name: result.user.name || user?.fullName || "",
          email: result.user.email || user?.primaryEmailAddress?.emailAddress || "",
          introduction: result.user.introduction || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive",
      });
    }
  }, [user?.fullName, user?.primaryEmailAddress?.emailAddress, toast]);

  useEffect(() => {
    if (isLoaded && user) {
      // Initialize with Clerk data
      setProfileData({
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        introduction: "",
      });
      
      // Fetch database profile
      fetchProfile();
    }
  }, [isLoaded, user, fetchProfile]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const result = await updateUserProfile(profileData);
      if (result.success) {
        setDbProfile(result.user);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (dbProfile) {
      setProfileData({
        name: dbProfile.name || user?.fullName || "",
        email: dbProfile.email || user?.primaryEmailAddress?.emailAddress || "",
        introduction: dbProfile.introduction || "",
      });
    }
    setIsEditing(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
                <p className="text-muted-foreground mb-4">
                  Please sign in to view your profile.
                </p>
                <Button onClick={() => router.push("/sign-in")}>
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <motion.h1 
              className="text-4xl font-bold text-foreground mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Profile
            </motion.h1>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Manage your account settings and preferences
            </motion.p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Card */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile Information
                      </CardTitle>
                      <CardDescription>
                        Update your personal information
                      </CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={isLoading}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          {isLoading ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                          disabled={isLoading}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Profile Image */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        {user.imageUrl ? (
                          <Image
                            src={user.imageUrl}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-10 w-10 text-primary" />
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {user.fullName || "User"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        {profileData.name || "Not set"}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <Input
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        placeholder="Enter your email"
                        type="email"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        {profileData.email || "Not set"}
                      </p>
                    )}
                  </div>

                  {/* Introduction Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Introduction
                    </label>
                    {isEditing ? (
                      <Textarea
                        value={profileData.introduction}
                        onChange={(e) => setProfileData({ ...profileData, introduction: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        {profileData.introduction || "No introduction provided"}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Access your saved content and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push("/bookmarks")}
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    View Bookmarks
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push("/interests")}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Update Interests
                  </Button>
                </CardContent>
              </Card>

              {/* Account Info */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Member since</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-sm">
                        {dbProfile?.createdAt ? new Date(dbProfile.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last updated</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-sm">
                        {dbProfile?.updatedAt ? new Date(dbProfile.updatedAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Interests</span>
                    <Badge variant="secondary">
                      {dbProfile?.interests?.length || 0}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 