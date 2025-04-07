import { NextRequest, NextResponse } from "next/server";
import db from "../../../../../lib/prismadb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    const existingEmployee = await db.employee.findUnique({
      where: { employeeId },
      select: { employeeId: true }
    });

    return NextResponse.json({
      exists: !!existingEmployee,
      available: !existingEmployee,
      message: existingEmployee 
        ? "Employee ID already in use" 
        : "Employee ID available"
    });

  } catch (error: any) {
    console.error("Error checking employee ID:", error);
    return NextResponse.json(
      { 
        error: "Validation Error",
        message: "Failed to validate employee ID"
      },
      { status: 500 }
    );
  }
}