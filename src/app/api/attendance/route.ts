import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoptions";
import db from "../../../../lib/prismadb";

// Function to determine attendance status based on check-in time
function determineAttendanceStatus(checkInTime: string | null): "ON_TIME" | "LATE" | "ABSENT" {
  if (!checkInTime) return "ABSENT";
  
  // Extract hours and minutes from time string (e.g., "9:45 AM" or "15:30")
  let hours: number;
  let minutes: number;
  
  if (checkInTime.includes(":")) {
    if (checkInTime.includes("AM") || checkInTime.includes("PM")) {
      // Parse 12-hour format (e.g., "9:45 AM")
      const timeParts = checkInTime.split(/[:\s]/);
      hours = parseInt(timeParts[0]);
      minutes = parseInt(timeParts[1]);
      
      if (checkInTime.includes("PM") && hours < 12) {
        hours += 12;
      } else if (checkInTime.includes("AM") && hours === 12) {
        hours = 0;
      }
    } else {
      // Parse 24-hour format (e.g., "15:30")
      const [hoursStr, minutesStr] = checkInTime.split(":");
      hours = parseInt(hoursStr);
      minutes = parseInt(minutesStr);
    }
  } else {
    // If no time format is recognized, default to ABSENT
    return "ABSENT";
  }
  
  // Check if time is before or at 10:00 AM
  if (hours < 10 || (hours === 10 && minutes === 0)) {
    return "ON_TIME";
  } else {
    return "LATE";
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const isAdmin = user?.role === "Admin";
    const data = await req.json();
    const { employeeId, date, checkInTime, checkOutTime, status } = data;

    if (isAdmin && employeeId) {
      const employee = await db.employee.findUnique({
        where: { id: employeeId },
      });

      if (!employee) {
        return NextResponse.json(
          { error: "Employee record not found" },
          { status: 404 }
        );
      }

      const dateString = date || new Date().toISOString().split("T")[0];

      const existingAttendance = await db.attendance.findFirst({
        where: {
          employeeId,
          date: dateString,
        },
      });

      // Calculate status based on check-in time if not provided
      const calculatedStatus = status || determineAttendanceStatus(checkInTime);
      
      // Create the attendance data, ensuring null values for ABSENT
      const attendanceData = {
        employeeId,
        date: dateString,
        checkInTime: calculatedStatus === "ABSENT" ? null : checkInTime,
        checkOutTime: calculatedStatus === "ABSENT" ? null : checkOutTime,
        status: calculatedStatus,
      };

      if (existingAttendance) {
        const updatedAttendance = await db.attendance.update({
          where: { id: existingAttendance.id },
          data: attendanceData,
        });
        
        return NextResponse.json({
          message: "Attendance updated successfully",
          attendance: updatedAttendance,
        });
      }

      const attendance = await db.attendance.create({
        data: attendanceData,
      });

      return NextResponse.json({
        message: "Attendance recorded successfully",
        attendance,
      }, { status: 201 });
    }

    // For regular employee check-in/out
    const today = new Date();
    const dateString = today.toISOString().split("T")[0];
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;

    const employee = await db.employee.findUnique({
      where: { id: session.user.id },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee record not found" },
        { status: 404 }
      );
    }

    const existingAttendance = await db.attendance.findFirst({
      where: {
        employeeId: session.user.id,
        date: dateString,
      },
    });

    if (existingAttendance) {
      if (!existingAttendance.checkOutTime) {
        const updatedAttendance = await db.attendance.update({
          where: { id: existingAttendance.id },
          data: {
            checkOutTime: formattedTime,
            updatedAt: today,
          },
        });
        return NextResponse.json({
          message: "Check-out recorded successfully",
          attendance: updatedAttendance,
        });
      }

      return NextResponse.json(
        { error: "Attendance already recorded for today", attendance: existingAttendance },
        { status: 409 }
      );
    }

    // Determine status based on check-in time (10:00 AM cutoff)
    const attendanceStatus = hours < 10 || (hours === 10 && minutes === 0) ? "ON_TIME" : "LATE";

    const attendance = await db.attendance.create({
      data: {
        employeeId: session.user.id,
        date: dateString,
        checkInTime: formattedTime,
        status: attendanceStatus,
      },
    });

    return NextResponse.json({
      message: "Attendance checked in successfully",
      attendance,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error recording attendance:", error);
    return NextResponse.json(
      { error: error.message || "Failed to record attendance" },
      { status: 500 }
    );
  }
}

// GET: Retrieve attendance records
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");
    const date = searchParams.get("date");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Check if the user is an admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const isAdmin = user?.role === "Admin";

    // If employeeId is specified and user is not admin, check permission
    if (employeeId && employeeId !== session.user.id && !isAdmin) {
      return NextResponse.json(
        { error: "You don't have permission to view this employee's attendance" },
        { status: 403 }
      );
    }

    // Build the query based on params
    let whereClause: any = {};

    if (employeeId) {
      whereClause.employeeId = employeeId;
    } else if (!isAdmin) {
      // If not admin, only show their own records
      whereClause.employeeId = session.user.id;
    }

    if (date) {
      whereClause.date = date;
    } else if (startDate && endDate) {
      whereClause.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    // Get attendance records with employee details
    const attendanceRecords = await db.attendance.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true,
            employeeType: true,
            designation: true,
            profileImage: true,
          },
        },
      },
    });

    return NextResponse.json(attendanceRecords);
  } catch (error: any) {
    console.error("Error fetching attendance data:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch attendance data" },
      { status: 500 }
    );
  }
}

// PUT: Update attendance record (admin only)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "Admin") {
      return NextResponse.json(
        { error: "Only administrators can update attendance records" },
        { status: 403 }
      );
    }

    const data = await req.json();
    const { id, checkInTime, checkOutTime, status } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Attendance ID is required" },
        { status: 400 }
      );
    }

    // Calculate status based on check-in time if status is not explicitly provided
    let calculatedStatus = status;
    if (!calculatedStatus && checkInTime) {
      calculatedStatus = determineAttendanceStatus(checkInTime);
    }
    
    // Create update data, ensuring null values for ABSENT
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    // If status is provided or calculated
    if (calculatedStatus) {
      updateData.status = calculatedStatus;
      
      // If ABSENT, explicitly set times to null
      if (calculatedStatus === "ABSENT") {
        updateData.checkInTime = null;
        updateData.checkOutTime = null;
      } else {
        // Otherwise, update with provided values
        if (checkInTime !== undefined) {
          updateData.checkInTime = checkInTime;
        }
        if (checkOutTime !== undefined) {
          updateData.checkOutTime = checkOutTime;
        }
      }
    } else {
      // If no status is provided or calculated
      if (checkInTime !== undefined) {
        updateData.checkInTime = checkInTime;
      }
      if (checkOutTime !== undefined) {
        updateData.checkOutTime = checkOutTime;
      }
    }

    // Update the attendance record
    const updatedAttendance = await db.attendance.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Attendance updated successfully",
      attendance: updatedAttendance,
    });
  } catch (error: any) {
    console.error("Error updating attendance:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update attendance" },
      { status: 500 }
    );
  }
}

// DELETE: Delete attendance record (admin only)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "Admin") {
      return NextResponse.json(
        { error: "Only administrators can delete attendance records" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Attendance ID is required" },
        { status: 400 }
      );
    }

    await db.attendance.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Attendance record deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting attendance:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete attendance record" },
      { status: 500 }
    );
  }
}