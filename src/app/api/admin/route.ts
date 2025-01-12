/**
 * Admin API Route
 * This route acts as an API endpoint to verify admin access.
 * It demonstrates how to implement role-based access control at the API level.
 */
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const role = await currentRole();
  if (role === UserRole.ADMIN) {
    return new NextResponse(null, { status: 200 });
  } else {
    return new NextResponse(null, { status: 403 });
  }
}
