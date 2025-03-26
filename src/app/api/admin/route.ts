import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoptions";
import db from "../../../../lib/prismadb";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { userId, name, role, avatar } = body;

    if (!userId) return new NextResponse("User ID required", { status: 400 });

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name,
        role,
        ...(avatar && { avatar }) 
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}