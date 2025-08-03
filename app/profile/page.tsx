"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Footer } from "../../components/landing/Footer";
import { Navbar } from "../../components/landing/Navbar";
import {
  User,
  Mail,
  Edit3,
  Save,
  X,
  Bookmark,
  Heart,
  Calendar,
  Camera,
  ArrowRight,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  getUserProfile, 
  updateUserProfile, 
  type UpdateUserProfileData 
} from "@/features/find-destinations/actions";
import { useToast } from "@/components/ui/use-toast";

interface UserProfile {
  id: string;
  clerkUserId: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  bio: string | null;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function ProfilePage() {
  const { user: clerkUser, isLoaded } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateUserProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    profileImage: "",
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut" as const,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isLoaded || !clerkUser) return;
      
      setIsLoading(true);
      try {
        const result = await getUserProfile();
        if (result.success && result.user) {
          setProfile(result.user);
          setFormData({
            firstName: result.user.firstName || "",
            lastName: result.user.lastName || "",
            email: result.user.email || "",
            bio: result.user.bio || "",
            profileImage: result.user.profileImage || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isLoaded, clerkUser, toast]);

  const handleSave = async () => {
    if (!clerkUser) return;

    setIsSaving(true);
    try {
      const result = await updateUserProfile(formData);
      if (result.success) {
        setProfile(result.user);
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
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        bio: profile.bio || "",
        profileImage: profile.profileImage || "",
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UpdateUserProfileData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="max-w-md mx-auto bg-card border border-border">
              <CardContent className="p-8 text-center">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <User className="h-8 w-8 text-primary" />
                </motion.div>
                <p className="text-muted-foreground">Loading profile...</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!clerkUser) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="max-w-md mx-auto bg-card border border-border">
              <CardContent className="p-8 text-center">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <User className="h-8 w-8 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Sign In Required
                </h3>
                <p className="text-muted-foreground mb-6">
                  Please sign in to view your profile.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => router.push("/sign-in")}
                    className="bg-primary hover:bg-primary/90 rounded-full px-6 py-2"
                  >
                    Sign In
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-1 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div
            className="absolute top-40 right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: "2s" }}
          />
          <motion.div
            className="absolute bottom-40 left-20 w-24 h-24 bg-primary/5 rounded-full blur-3xl"
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: "4s" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <motion.div 
          className="container max-w-4xl mx-auto px-4 py-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <User className="h-8 w-8 text-primary" />
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-foreground">
              My Profile
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Manage your personal information and preferences
            </p>
          </motion.div>

          {isLoading ? (
            <motion.div 
              className="space-y-8"
              variants={containerVariants}
            >
              <motion.div variants={cardVariants}>
                <Card className="bg-card backdrop-blur-xl border border-border">
                  <CardHeader>
                    <Skeleton className="h-8 w-48 bg-muted" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-20 h-20 rounded-full bg-muted" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-6 w-32 bg-muted" />
                        <Skeleton className="h-4 w-48 bg-muted" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Skeleton className="h-12 w-full bg-muted" />
                      <Skeleton className="h-12 w-full bg-muted" />
                      <Skeleton className="h-12 w-full bg-muted" />
                      <Skeleton className="h-24 w-full bg-muted" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-8"
              variants={containerVariants}
            >
              {/* Profile Information Card */}
              <motion.div variants={cardVariants}>
                <Card className="bg-card backdrop-blur-xl border border-border">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-foreground">
                      Personal Information
                    </CardTitle>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              onClick={handleSave}
                              disabled={isSaving}
                              className="bg-primary hover:bg-primary/90 rounded-full px-4 py-2"
                              size="sm"
                            >
                              {isSaving ? (
                                <motion.div
                                  className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                              ) : (
                                <Save className="h-4 w-4 mr-2" />
                              )}
                              Save
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              onClick={handleCancel}
                              variant="outline"
                              className="border-border hover:border-border/60 rounded-full px-4 py-2"
                              size="sm"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </motion.div>
                        </>
                      ) : (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => setIsEditing(true)}
                            variant="outline"
                            className="border-border hover:border-border/60 rounded-full px-4 py-2"
                            size="sm"
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Image */}
                    <div className="flex items-center gap-6">
                      <motion.div
                        className="relative w-24 h-24 rounded-full overflow-hidden bg-primary/10 border-4 border-primary/20"
                        whileHover={{ scale: 1.05 }}
                      >
                        {formData.profileImage ? (
                          <img
                            src={formData.profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="h-12 w-12 text-primary" />
                          </div>
                        )}
                        {isEditing && (
                          <motion.div
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Camera className="h-6 w-6 text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {formData.firstName && formData.lastName 
                            ? `${formData.firstName} ${formData.lastName}`
                            : "Your Name"
                          }
                        </h3>
                        <p className="text-muted-foreground">
                          {formData.email || "your.email@example.com"}
                        </p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">First Name</label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          disabled={!isEditing}
                          className="bg-background border border-border"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Last Name</label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          disabled={!isEditing}
                          className="bg-background border border-border"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <Input
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        disabled={!isEditing}
                        className="bg-background border border-border"
                        placeholder="Enter your email"
                        type="email"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Bio</label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        disabled={!isEditing}
                        className="bg-background border border-border min-h-[100px]"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Profile Image URL</label>
                      <Input
                        value={formData.profileImage}
                        onChange={(e) => handleInputChange("profileImage", e.target.value)}
                        disabled={!isEditing}
                        className="bg-background border border-border"
                        placeholder="Enter image URL"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions Card */}
              <motion.div variants={cardVariants}>
                <Card className="bg-card backdrop-blur-xl border border-border">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-primary" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={() => router.push("/bookmarks")}
                          variant="outline"
                          className="w-full h-16 border-border hover:border-border/60 rounded-2xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl">
                              <Bookmark className="h-6 w-6 text-primary" />
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-foreground">View Bookmarks</div>
                              <div className="text-sm text-muted-foreground">Your saved destinations</div>
                            </div>
                            <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />
                          </div>
                        </Button>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={() => router.push("/interests")}
                          variant="outline"
                          className="w-full h-16 border-border hover:border-border/60 rounded-2xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl">
                              <Heart className="h-6 w-6 text-primary" />
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-foreground">Update Interests</div>
                              <div className="text-sm text-muted-foreground">Customize your preferences</div>
                            </div>
                            <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />
                          </div>
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Account Info Card */}
              {profile && (
                <motion.div variants={cardVariants}>
                  <Card className="bg-card backdrop-blur-xl border border-border">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <UserCheck className="h-6 w-6 text-primary" />
                        Account Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-sm text-muted-foreground">Member Since</div>
                            <div className="font-medium text-foreground">
                              {new Date(profile.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl">
                          <Mail className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-sm text-muted-foreground">Clerk User ID</div>
                            <div className="font-medium text-foreground font-mono text-sm">
                              {profile.clerkUserId.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
} 