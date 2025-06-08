import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

// This is a simple middleware to simulate authentication protection
// In a real app, you would verify JWT tokens or session cookies
export function middleware(request: NextRequest) {
  // In a real app, this would check for auth token in cookies or headers
  const isAuthenticated = false; // Hard-coded for demo purposes

  // Protected routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/interests",
    "/previous-trips",
    "/find-destinations",
  ];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If trying to access a protected route while not authenticated, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    "/((?!_next/static|_next/image|favicon.ico|api|login|signup).*)",
  ],
};
