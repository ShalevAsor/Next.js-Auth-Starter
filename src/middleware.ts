/**
 * This middleware runs on every request to handle authentication and route protection.
 * It determines whether to allow access, redirect, or deny requests based on
 * authentication status and route type.
 */

import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
// Initialize NextAuth with our configuration
const { auth } = NextAuth(authConfig);

/**
 * Main middleware function that handles all incoming requests
 * This acts as a gateway, protecting routes and managing authentication flow
 */

export default auth((req) => {
  // Extract the URL information from the request
  const { nextUrl } = req;
  // Check if user is logged in by converting session to boolean
  const isLoggedIn = !!req.auth;
  // Determine the type of route being accessed
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  // Handle API authentication routes
  // We don't interfere with these as they're handled by NextAuth
  if (isApiAuthRoute) {
    return;
  }
  // Handle authentication routes (login, register, etc.)
  // If user is already logged in, redirect them to the default page
  // This prevents authenticated users from accessing login/register pages
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }
  // Handle protected routes
  // If user is not logged in and tries to access a non-public route,
  // redirect them to login page with a callback URL
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    // Encode the URL to handle special characters safely

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    // Create redirect URL to login page with encoded callback

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }
  return;
});

/**
 * Middleware matcher configuration
 * Defines which routes should trigger the middleware
 *
 * The matcher uses a regular expression pattern to match:
 * - All routes except static files (those with extensions)
 * - The root path (/)
 * - API routes (/api/*)
 * - TRPC routes if using tRPC
 *
 * This optimization ensures middleware only runs on relevant routes
 */

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
