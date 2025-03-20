import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoptions";
import db from "../../../../lib/prismadb";


export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    if (session.user.role !== "Admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error("USERS_FETCH_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}