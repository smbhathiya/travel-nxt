"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  interests: string[];
  previousDestinations: {
    place: string;
    visitDate: string;
  }[];
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
  updateInterests: (interests: string[]) => Promise<void>;
  updatePreviousDestinations: (
    destinations: { place: string; visitDate: string }[]
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // For demo purposes - would be replaced by actual authentication logic
  const login = async (email: string, password: string) => {
    // This would be replaced with actual API call
    console.log("Logging in with:", email);

    // Simulating successful login
    setUser({
      id: "user-1",
      name: "Demo User",
      email: email,
      interests: ["beach", "hiking", "food"],
      previousDestinations: [
        { place: "Paris, France", visitDate: "2023-05" },
        { place: "Tokyo, Japan", visitDate: "2024-01" },
      ],
    });
  };

  const logout = () => {
    setUser(null);
  };

  const signup = async (name: string, email: string, password: string) => {
    // This would be replaced with actual API call
    console.log("Signing up:", name, email);

    // Simulating successful signup
    setUser({
      id: "user-1",
      name: name,
      email: email,
      interests: [],
      previousDestinations: [],
    });
  };

  const updateInterests = async (interests: string[]) => {
    if (user) {
      setUser({
        ...user,
        interests,
      });
    }
  };

  const updatePreviousDestinations = async (
    previousDestinations: { place: string; visitDate: string }[]
  ) => {
    if (user) {
      setUser({
        ...user,
        previousDestinations,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
        updateInterests,
        updatePreviousDestinations,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
