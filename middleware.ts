import { NextResponse } from "next/server";
import { auth } from "./src/auth";

export async function middleware(request) {
  const session = await auth();
  const userRole = session?.user?.role;
  const path = request.nextUrl.pathname;

  // Check if user is trying to access admin routes
  if (path.startsWith('/admin') && userRole !== 'Admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check if user is trying to access HR routes
  if (path.startsWith('/hr') && userRole !== 'HR' && userRole !== 'Admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow access to employee routes and public routes
  return NextResponse.next();
}

// Specify which routes this middleware applies to
export const config = {
  matcher: ['/admin/:path*', '/hr/:path*', '/dashboard/:path*'],
};