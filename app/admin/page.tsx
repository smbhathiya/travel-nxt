"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  Search,
  MapPin,
  Star,
  Image as ImageIcon,
  Building,
  Eye,
  Edit,
  Trash2,
  Save,
  X,
  ChevronDown,
  Waves,
  Fish,
  TreePine,
  Flower2,
  Landmark,
  Building2,
  Trees,
  Church,
} from "lucide-react";
import Image from "next/image";

interface Location {
  id: string;
  name: string;
  type: string;
  locatedCity: string;
  about: string;
  overallRating: number;
  unsplashImage: string;
}

interface NewLocation {
  name: string;
  type: string;
  locatedCity: string;
  about: string;
  unsplashImage: string;
}

interface LocationType {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export default function AdminPage() {
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showEditTypeDropdown, setShowEditTypeDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const editDropdownRef = useRef<HTMLDivElement>(null);
  const [newLocation, setNewLocation] = useState<NewLocation>({
    name: "",
    type: "",
    locatedCity: "",
    about: "",
    unsplashImage: "",
  });

  // Predefined location types from interests page
  const predefinedLocationTypes: LocationType[] = [
    { id: "beaches", name: "Beaches", icon: <Waves className="h-4 w-4" /> },
    {
      id: "bodies of water",
      name: "Bodies of Water",
      icon: <Fish className="h-4 w-4" />,
    },
    { id: "farms", name: "Farms", icon: <TreePine className="h-4 w-4" /> },
    { id: "gardens", name: "Gardens", icon: <Flower2 className="h-4 w-4" /> },
    {
      id: "historic sites",
      name: "Historic Sites",
      icon: <Landmark className="h-4 w-4" />,
    },
    { id: "museums", name: "Museums", icon: <Building2 className="h-4 w-4" /> },
    {
      id: "national parks",
      name: "National Parks",
      icon: <Trees className="h-4 w-4" />,
    },
    {
      id: "nature & wildlife areas",
      name: "Nature & Wildlife Areas",
      icon: <Trees className="h-4 w-4" />,
    },
    {
      id: "waterfalls",
      name: "Waterfalls",
      icon: <Waves className="h-4 w-4" />,
    },
    {
      id: "zoological gardens",
      name: "Zoological Gardens",
      icon: <Fish className="h-4 w-4" />,
    },
    {
      id: "religious sites",
      name: "Religious Sites",
      icon: <Church className="h-4 w-4" />,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowTypeDropdown(false);
      }
      if (
        editDropdownRef.current &&
        !editDropdownRef.current.contains(event.target as Node)
      ) {
        setShowEditTypeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchLocations = useCallback(async () => {
    try {
      const response = await fetch("/api/locations");
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast({
        title: "Error",
        description: "Failed to fetch locations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, setLocations, setIsLoading]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleAddLocation = async () => {
    if (
      !newLocation.name ||
      !newLocation.type ||
      !newLocation.locatedCity ||
      !newLocation.about
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLocation),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Location added successfully",
        });
        setNewLocation({
          name: "",
          type: "",
          locatedCity: "",
          about: "",
          unsplashImage: "",
        });
        setIsAdding(false);
        fetchLocations();
      } else {
        throw new Error("Failed to add location");
      }
    } catch (error) {
      console.error("Error adding location:", error);
      toast({
        title: "Error",
        description: "Failed to add location",
        variant: "destructive",
      });
    }
  };

  const handleEditLocation = async () => {
    if (
      !editingLocation ||
      !editingLocation.name ||
      !editingLocation.type ||
      !editingLocation.locatedCity ||
      !editingLocation.about
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/locations/${editingLocation.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingLocation.name,
          type: editingLocation.type,
          locatedCity: editingLocation.locatedCity,
          about: editingLocation.about,
          unsplashImage: editingLocation.unsplashImage,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Location updated successfully",
        });
        setEditingLocation(null);
        setIsEditing(false);
        fetchLocations();
      } else {
        throw new Error("Failed to update location");
      }
    } catch (error) {
      console.error("Error updating location:", error);
      toast({
        title: "Error",
        description: "Failed to update location",
        variant: "destructive",
      });
    }
  };

  const startEditing = (location: Location) => {
    setEditingLocation(location);
    setIsEditing(true);
    setIsAdding(false);
  };

  const cancelEditing = () => {
    setEditingLocation(null);
    setIsEditing(false);
    setShowEditTypeDropdown(false);
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return;

    try {
      const response = await fetch(`/api/locations/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Location deleted successfully",
        });
        fetchLocations();
      } else {
        throw new Error("Failed to delete location");
      }
    } catch (error) {
      console.error("Error deleting location:", error);
      toast({
        title: "Error",
        description: "Failed to delete location",
        variant: "destructive",
      });
    }
  };

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.locatedCity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const locationTypes = Array.from(
    new Set(locations.map((l) => l.type))
  ).sort();

  const handleTypeSelect = (type: string) => {
    setNewLocation({ ...newLocation, type });
    setShowTypeDropdown(false);
  };

  const handleEditTypeSelect = (type: string) => {
    if (editingLocation) {
      setEditingLocation({ ...editingLocation, type });
    }
    setShowEditTypeDropdown(false);
  };

  const getTypeIcon = (typeName: string) => {
    const type = predefinedLocationTypes.find(
      (t) => t.name.toLowerCase() === typeName.toLowerCase()
    );
    return type ? type.icon : <MapPin className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-background">
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
              Admin Dashboard
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Manage location details and content
            </motion.p>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Add New Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Location
                  </CardTitle>
                  <CardDescription>
                    Add a new location to the database
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isAdding ? (
                    <Button
                      onClick={() => setIsAdding(true)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Location
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Location Name *
                        </label>
                        <Input
                          value={newLocation.name}
                          onChange={(e) =>
                            setNewLocation({
                              ...newLocation,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter location name"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Type *</label>
                        <div className="relative" ref={dropdownRef}>
                          <button
                            type="button"
                            onClick={() =>
                              setShowTypeDropdown(!showTypeDropdown)
                            }
                            className="w-full flex items-center justify-between px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <span
                              className={
                                newLocation.type
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }
                            >
                              {newLocation.type || "Select location type"}
                            </span>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </button>

                          {showTypeDropdown && (
                            <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                              <div className="p-1">
                                {predefinedLocationTypes.map((type) => (
                                  <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => handleTypeSelect(type.name)}
                                    className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex items-center gap-2"
                                  >
                                    {type.icon}
                                    {type.name}
                                  </button>
                                ))}
                                <Separator className="my-1" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewLocation({
                                      ...newLocation,
                                      type: "",
                                    });
                                    setShowTypeDropdown(false);
                                  }}
                                  className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-muted-foreground"
                                >
                                  Clear selection
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {predefinedLocationTypes.length} predefined types
                          available
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">City *</label>
                        <Input
                          value={newLocation.locatedCity}
                          onChange={(e) =>
                            setNewLocation({
                              ...newLocation,
                              locatedCity: e.target.value,
                            })
                          }
                          placeholder="Enter city name"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Description *
                        </label>
                        <Textarea
                          value={newLocation.about}
                          onChange={(e) =>
                            setNewLocation({
                              ...newLocation,
                              about: e.target.value,
                            })
                          }
                          placeholder="Describe the location..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Image URL</label>
                        <Input
                          value={newLocation.unsplashImage}
                          onChange={(e) =>
                            setNewLocation({
                              ...newLocation,
                              unsplashImage: e.target.value,
                            })
                          }
                          placeholder="Unsplash image URL"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleAddLocation} className="flex-1">
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsAdding(false);
                            setNewLocation({
                              name: "",
                              type: "",
                              locatedCity: "",
                              about: "",
                              unsplashImage: "",
                            });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Edit Location */}
              {isEditing && editingLocation && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit className="h-5 w-5" />
                      Edit Location
                    </CardTitle>
                    <CardDescription>Update location details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Location Name *
                        </label>
                        <Input
                          value={editingLocation.name}
                          onChange={(e) =>
                            setEditingLocation({
                              ...editingLocation,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter location name"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Type *</label>
                        <div className="relative" ref={editDropdownRef}>
                          <button
                            type="button"
                            onClick={() =>
                              setShowEditTypeDropdown(!showEditTypeDropdown)
                            }
                            className="w-full flex items-center justify-between px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <span
                              className={
                                editingLocation.type
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }
                            >
                              {editingLocation.type || "Select location type"}
                            </span>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </button>

                          {showEditTypeDropdown && (
                            <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                              <div className="p-1">
                                {predefinedLocationTypes.map((type) => (
                                  <button
                                    key={type.id}
                                    type="button"
                                    onClick={() =>
                                      handleEditTypeSelect(type.name)
                                    }
                                    className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex items-center gap-2"
                                  >
                                    {type.icon}
                                    {type.name}
                                  </button>
                                ))}
                                <Separator className="my-1" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingLocation({
                                      ...editingLocation,
                                      type: "",
                                    });
                                    setShowEditTypeDropdown(false);
                                  }}
                                  className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-muted-foreground"
                                >
                                  Clear selection
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {predefinedLocationTypes.length} predefined types
                          available
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">City *</label>
                        <Input
                          value={editingLocation.locatedCity}
                          onChange={(e) =>
                            setEditingLocation({
                              ...editingLocation,
                              locatedCity: e.target.value,
                            })
                          }
                          placeholder="Enter city name"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Description *
                        </label>
                        <Textarea
                          value={editingLocation.about}
                          onChange={(e) =>
                            setEditingLocation({
                              ...editingLocation,
                              about: e.target.value,
                            })
                          }
                          placeholder="Describe the location..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Image URL</label>
                        <Input
                          value={editingLocation.unsplashImage}
                          onChange={(e) =>
                            setEditingLocation({
                              ...editingLocation,
                              unsplashImage: e.target.value,
                            })
                          }
                          placeholder="Unsplash image URL"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleEditLocation} className="flex-1">
                          <Save className="h-4 w-4 mr-2" />
                          Update
                        </Button>
                        <Button variant="outline" onClick={cancelEditing}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Statistics */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Locations
                    </span>
                    <Badge variant="secondary">{locations.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Location Types
                    </span>
                    <Badge variant="secondary">{locationTypes.length}</Badge>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">
                      Types:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {locationTypes.slice(0, 3).map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                      {locationTypes.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{locationTypes.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Locations List */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        All Locations
                      </CardTitle>
                      <CardDescription>
                        Manage existing locations
                      </CardDescription>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-24 bg-muted rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : filteredLocations.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {searchTerm
                          ? "No locations found matching your search."
                          : "No locations found."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredLocations.map((location) => (
                        <motion.div
                          key={location.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center overflow-hidden relative">
                              {location.unsplashImage ? (
                                <Image
                                  src={location.unsplashImage}
                                  alt={location.name}
                                  fill
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-lg truncate">
                                    {location.name}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs flex items-center gap-1"
                                    >
                                      {getTypeIcon(location.type)}
                                      {location.type}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <Building className="h-3 w-3" />
                                      {location.locatedCity}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                      <span className="text-sm font-medium">
                                        {location.overallRating.toFixed(1)}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                    {location.about}
                                  </p>
                                </div>

                                <div className="flex gap-2 ml-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      window.open(
                                        `/locations/${location.id}`,
                                        "_blank"
                                      )
                                    }
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => startEditing(location)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteLocation(location.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
