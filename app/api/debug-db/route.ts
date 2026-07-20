import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const envVars = {
      DATABASE_URL_exists: !!process.env.DATABASE_URL,
      DIRECT_URL_exists: !!process.env.DIRECT_URL,
      DATABASE_URI_exists: !!process.env.DATABASE_URI,
      NODE_ENV: process.env.NODE_ENV,
    };

    // Try a simple query
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
      userCount,
      envVars,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({
      success: false,
      message: "Database connection failed",
      error: err.message || String(error),
      envVars: {
        DATABASE_URL_exists: !!process.env.DATABASE_URL,
        DIRECT_URL_exists: !!process.env.DIRECT_URL,
        DATABASE_URI_exists: !!process.env.DATABASE_URI,
        NODE_ENV: process.env.NODE_ENV,
      }
    }, { status: 500 });
  }
}
