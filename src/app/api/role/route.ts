import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoptions";
import db from "../../../../lib/prismadb";


export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    if (session.user.role !== "Admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    
    const { userId, newRole } = await req.json();
    
    if (!userId || !newRole) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
  
    if (!["Admin", "HR", "Employee"].includes(newRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    
    const updatedUser = await db.user.update({
      where: {
        id: userId
      },
      data: {
        role: newRole
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("CHANGE_ROLE_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}