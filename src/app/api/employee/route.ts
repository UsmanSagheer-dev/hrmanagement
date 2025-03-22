import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { EMPLOYEE_VALIDATION_FORM_ITEMS } from "../../constants/formConstants";
import db from "../../../../lib/prismadb";
import { authOptions } from "../../../../lib/authoptions";

export const POST = async (request: NextRequest) => {
  try {
    // Authentication Check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    // Authorization Check (Example: Only HR/Admin can create)
    if (!["HR", "Admin"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const employeeData = await request.json();
    
    // Field Validation
    const requiredFields = EMPLOYEE_VALIDATION_FORM_ITEMS;
    for (const field of requiredFields) {
      if (!employeeData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Link employee to logged-in user
    const employee = await db.employee.create({
      data: {
        ...employeeData,
        userId: session.user.id // Add user relationship
      }
    });

    return NextResponse.json(
      { data: employee, success: true },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const GET = async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    // Role-based data filtering
    let whereClause = {};
    if (session.user.role === "HR") {
      whereClause = { department: "HR" };
    }

    const employees = await db.employee.findMany({
      where: whereClause
    });

    return NextResponse.json(
      { data: employees, success: true },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const PUT = async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const { id, ...data } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: "Missing employee ID" },
        { status: 400 }
      );
    }

    // Ownership check
    const existingEmployee = await db.employee.findUnique({
      where: { id }
    });

    if (
      session.user.role !== "Admin" &&
      existingEmployee?.userId !== session.user.id
    ) {
      return NextResponse.json(
        { error: "Not authorized to update this employee" },
        { status: 403 }
      );
    }

    const updatedEmployee = await db.employee.update({
      where: { id },
      data
    });

    return NextResponse.json(
      { data: updatedEmployee, success: true },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: "Missing employee ID" },
        { status: 400 }
      );
    }

    // Admin-only deletion
    if (session.user.role !== "Admin") {
      return NextResponse.json(
        { error: "Only admins can delete employees" },
        { status: 403 }
      );
    }

    await db.employee.delete({
      where: { id }
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};