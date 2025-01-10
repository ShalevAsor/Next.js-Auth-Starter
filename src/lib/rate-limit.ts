import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Redis client for rate limiting.
 * This is separate from your main database and is used only for tracking login attempts.
 * Redis is chosen for its speed and automatic cleanup of expired records.
 */
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

/**
 * Rate limiter configuration
 * Using a sliding window of 5 attempts per minute
 */
const ratelimit = new Ratelimit({
  redis,
  // 5 login attempts per minute
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "@/auth",
});

/**
 * Checks if the current login attempt should be allowed based on previous attempts
 * @param identifier - A unique string combining IP and email
 * @returns Object containing limit information and time until reset
 */
export async function checkLoginRateLimit(identifier: string) {
  const { success, reset, remaining } = await ratelimit.limit(identifier);

  if (!success) {
    // Calculate remaining time in seconds
    const timeRemaining = Math.ceil((reset - Date.now()) / 1000);

    throw new Error(
      `Too many login attempts. Please try again in ${timeRemaining} seconds`
    );
  }

  return { remaining, reset };
}
