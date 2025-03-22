import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/authoptions";

export async function middleware(request: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log("Middleware Session:", session); // Debug

  const path = request.nextUrl.pathname;

  if (path.startsWith("/api")) {
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (!session?.user?.id) {
    if (path.startsWith("/auth")) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userRole = session.user.role;
  if (path.startsWith("/admin") && userRole !== "Admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (path.startsWith("/hr") && !["HR", "Admin"].includes(userRole)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/hr/:path*", "/dashboard/:path*", "/auth/:path*"],
};