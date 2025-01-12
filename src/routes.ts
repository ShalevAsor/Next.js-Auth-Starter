/**
 * An array of routes that are public and do not require authentication.
 */
export const publicRoutes = ["/", "/auth/new-verification"];
/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];
/**
 * The prefix for the API authentication routes
 * Routes that start with this prefix are used for API authentication
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default route to redirect to after logging in
 */

export const DEFAULT_LOGIN_REDIRECT = "/settings";

/**
 * The default route to redirect to after logging out
 */
export const DEFAULT_LOGOUT_REDIRECT = "/auth/login";
