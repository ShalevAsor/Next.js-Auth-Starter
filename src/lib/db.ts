/**
 * Prisma Client configuration and initialization.
 * This file handles the database connection singleton to prevent multiple instances
 * during development hot reloading.
 */

import { PrismaClient } from "@prisma/client";

// Define a global type that includes our Prisma instance
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
/**
 * Export a singleton instance of PrismaClient
 * This ensures we don't create multiple database connections
 * - In production: Creates a new instance
 * - In development: Reuses the existing instance
 */
export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
