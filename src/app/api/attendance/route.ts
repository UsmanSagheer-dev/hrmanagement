import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoptions";
import db from "../../../../lib/prismadb";

function determineAttendanceStatus(
  checkInTime: string | null
): "ON_TIME" | "LATE" | "ABSENT" {
  if (!checkInTime) return "ABSENT";

  let hours: number;
  let minutes: number;

  if (checkInTime.includes(":")) {
    if (checkInTime.includes("AM") || checkInTime.includes("PM")) {
      const timeParts = checkInTime.split(/[:\s]/);
      hours = parseInt(timeParts[0]);
      minutes = parseInt(timeParts[1]);

      if (checkInTime.includes("PM") && hours < 12) {
        hours += 12;
      } else if (checkInTime.includes("AM") && hours === 12) {
        hours = 0;
      }
    } else {
      const [hoursStr, minutesStr] = checkInTime.split(":");
      hours = parseInt(hoursStr);
      minutes = parseInt(minutesStr);
    }
  } else {
    return "ABSENT";
  }

  if (hours < 10 || (hours === 10 && minutes === 0)) {
    return "ON_TIME";
  } else {
    return "LATE";
  }
}

async function markAbsentEmployees() {
  try {
    const today = new Date().toISOString().split("T")[0];

    const employees = await db.employee.findMany({
      select: { id: true },
    });

    for (const employee of employees) {
      // Check if employee has an approved leave request for today
      const approvedLeave = await db.leaveRequest.findFirst({
        where: {
          employeeId: employee.id,
          startDate: { lte: today },
          endDate: { gte: today },
          status: "APPROVED",
        },
      });

      // Skip marking absent if employee has approved leave
      if (approvedLeave) {
        continue;
      }

      const attendanceRecord = await db.attendance.findFirst({
        where: {
          employeeId: employee.id,
          date: today,
        },
      });

      if (!attendanceRecord) {
        await db.attendance.create({
          data: {
            employeeId: employee.id,
            date: today,
            checkInTime: "",
            checkOutTime: null,
            status: "ABSENT",
          },
        });
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error };
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
    const { employeeId, date, checkInTime, status, autoMarkAbsent } = data;

    // If the autoMarkAbsent flag is set, run the absent marking function
    if (autoMarkAbsent && isAdmin) {
      const result = await markAbsentEmployees();
      return NextResponse.json({
        message: result.success
          ? "Absent employees marked successfully"
          : "Failed to mark absent employees",
        success: result.success,
      });
    }

    const dateString = date || new Date().toISOString().split("T")[0];

    // Check for approved leave request
    const approvedLeave = await db.leaveRequest.findFirst({
      where: {
        employeeId: isAdmin ? employeeId : session.user.id,
        startDate: { lte: dateString },
        endDate: { gte: dateString },
        status: "APPROVED",
      },
    });

    if (approvedLeave) {
      return NextResponse.json(
        { error: "Cannot mark attendance for approved leave days" },
        { status: 400 }
      );
    }

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

      const existingAttendance = await db.attendance.findFirst({
        where: {
          employeeId,
          date: dateString,
        },
      });

      const calculatedStatus = status || determineAttendanceStatus(checkInTime);

      const attendanceData = {
        employeeId,
        date: dateString,
        checkInTime: calculatedStatus === "ABSENT" ? "" : checkInTime,
        checkOutTime: calculatedStatus === "ABSENT" ? null : undefined,
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

      return NextResponse.json(
        {
          message: "Attendance recorded successfully",
          attendance,
        },
        { status: 201 }
      );
    }

    const today = new Date();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedTime = `${formattedHours}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;

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
        {
          error: "Attendance already recorded for today",
          attendance: existingAttendance,
        },
        { status: 409 }
      );
    }

    const attendanceStatus =
      hours < 10 || (hours === 10 && minutes === 0) ? "ON_TIME" : "LATE";

    const attendance = await db.attendance.create({
      data: {
        employeeId: session.user.id,
        date: dateString,
        checkInTime: formattedTime,
        status: attendanceStatus,
      },
    });

    return NextResponse.json(
      {
        message: "Attendance checked in successfully",
        attendance,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to record attendance" },
      { status: 500 }
    );
  }
}

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

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const isAdmin = user?.role === "Admin";

    if (employeeId && employeeId !== session.user.id && !isAdmin) {
      return NextResponse.json(
        {
          error: "You don't have permission to view this employee's attendance",
        },
        { status: 403 }
      );
    }

    let whereClause: any = {};

    if (employeeId) {
      whereClause.employeeId = employeeId;
    } else if (!isAdmin) {
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
    return NextResponse.json(
      { error: error.message || "Failed to fetch attendance data" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    const { id, checkInTime, status } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Attendance ID is required" },
        { status: 400 }
      );
    }

    let calculatedStatus = status;
    if (!calculatedStatus && checkInTime) {
      calculatedStatus = determineAttendanceStatus(checkInTime);
    }

    const updatedAttendance = await db.attendance.update({
      where: { id },
      data: {
        updatedAt: new Date(),
        status: calculatedStatus,
        checkInTime: calculatedStatus === "ABSENT" ? "" : checkInTime,
        checkOutTime: calculatedStatus === "ABSENT" ? null : undefined,
      },
    });

    return NextResponse.json({
      message: "Attendance updated successfully",
      attendance: updatedAttendance,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update attendance" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    return NextResponse.json({
      message: "Attendance record deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete attendance record" },
      { status: 500 }
    );
  }
}