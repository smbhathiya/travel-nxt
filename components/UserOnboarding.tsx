"use client";

import UserOnboardingModal from "@/components/UserOnboardingModal";

export function UserOnboarding({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UserOnboardingModal />
      {children}
    </>
  );
}
