"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function UserOnboarding({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkUserInterests = async () => {
      if (!isLoaded || !user) return;

      try {
        const response = await fetch('/api/user/interests');
        if (response.ok) {
          const data = await response.json();
          
          // If user has no interests and they're not already on the interests page, redirect them
          if ((!data.interests || data.interests.length === 0) && 
              window.location.pathname !== '/interests' &&
              window.location.pathname !== '/sign-in' &&
              window.location.pathname !== '/sign-up' &&
              !window.location.pathname.includes('sign-in') &&
              !window.location.pathname.includes('sign-up')) {
            router.push('/interests');
          }
        }
      } catch (error) {
        console.error('Error checking user interests:', error);
      }
    };

    checkUserInterests();
  }, [user, isLoaded, router]);

  return <>{children}</>;
}
