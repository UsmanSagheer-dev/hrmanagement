import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoptions";
import db from "../../../../lib/prismadb";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "Admin") {
      return NextResponse.json(
        { error: "Only administrators can access pending employee details" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Pending employee ID is required" },
        { status: 400 }
      );
    }

    const pendingEmployee = await db.pendingEmployee.findUnique({
      where: { id },
    });

    if (!pendingEmployee) {
      return NextResponse.json(
        { error: "Pending employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(pendingEmployee);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch pending employee data" },
      { status: 500 }
    );
  }
}