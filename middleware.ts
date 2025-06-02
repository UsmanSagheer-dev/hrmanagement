import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/authoptions";

const protectedRoutes = {
  admin: ["/admin", "/dashboard"],
  employee: ["/employee"],
  hr: ["/hr"],
  public: ["/auth", "/login", "/register"],
};

export async function middleware(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const path = request.nextUrl.pathname;

  const isPublicRoute = protectedRoutes.public.some((route) =>
    path.startsWith(route)
  );
  if (!session?.user?.id) {
    if (isPublicRoute) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userRole = session.user.role || "Employee";

  if (path.startsWith("/dashboard")) {
    if (userRole !== "Admin") {
      return NextResponse.redirect(
        new URL(`/${userRole.toLowerCase()}`, request.url)
      );
    }
    return NextResponse.next();
  }

  if (path.startsWith("/admin") && userRole !== "Admin") {
    return NextResponse.redirect(
      new URL(`/${userRole.toLowerCase()}`, request.url)
    );
  }
  if (path.startsWith("/employee") && userRole !== "Employee") {
    return NextResponse.redirect(
      new URL(`/${userRole.toLowerCase()}`, request.url)
    );
  }
  if (path.startsWith("/hr") && !["HR", "Admin"].includes(userRole)) {
    return NextResponse.redirect(
      new URL(`/${userRole.toLowerCase()}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/hr/:path*",
    "/employee/:path*",
    "/dashboard/:path*",
    "/auth/:path*",
    "/login",
    "/register",
  ],
};
