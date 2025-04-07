import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoptions";
import db from "../../../../lib/prismadb";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }
    
    const data = await req.json();
    
    const formattedData = {
      ...data,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      joiningDate: data.joiningDate ? new Date(data.joiningDate) : null,
    };
    
    // Check for existing employee with same employeeId
    const existingEmployee = await db.employee.findFirst({
      where: {
        employeeId: formattedData.employeeId,
      },
    });

    if (existingEmployee) {
      return NextResponse.json(
        { error: "Employee with this ID already exists", field: "employeeId" },
        { status: 409 }
      );
    }

    const employee = await db.employee.create({
      data: formattedData,
    });
    
    return NextResponse.json(
      { message: "Employee data saved successfully", employee },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error saving employee data:", error);
    
    return NextResponse.json(
      { error: error.message || "Failed to save employee data" },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }
    
    const employees = await db.employee.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(employees);
  } catch (error: any) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch employees" },
      { status: 500 }
    );
  }
}