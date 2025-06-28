import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { UserOnboarding } from "../components/UserOnboarding";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TravelNxt - Discover Sri Lanka",
  description:
    "Get personalized travel recommendations for Sri Lanka based on your interests. Discover beaches, mountains, cultural sites, and more in the Pearl of the Indian Ocean.",
  keywords: [
    "Sri Lanka travel",
    "AI travel recommendations",
    "Sri Lanka destinations",
    "travel planning",
    "Sri Lanka tourism",
    "personalized travel",
  ],
  openGraph: {
    title: "TravelNxt - Discover Sri Lanka",
    description:
      "AI-powered travel recommendations for Sri Lanka based on your interests",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <UserOnboarding>
              {children}
            </UserOnboarding>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
