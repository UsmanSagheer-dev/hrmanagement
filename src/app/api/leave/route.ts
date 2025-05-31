import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoptions";
import db from "../../../../lib/prismadb";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { startDate, endDate, reason } = data;

    // Create leave request
    const leaveRequest = await db.leaveRequest.create({
      data: {
        employeeId: session.user.id,
        startDate,
        endDate,
        reason,
        status: "PENDING"
      }
    });

    // Get admin users
    const adminUsers = await db.user.findMany({
      where: { role: "Admin" },
      select: { id: true }
    });

    // Create notifications for admins
    const notificationPromises = adminUsers.map((admin) => {
      return db.notification.create({
        data: {
          type: "LEAVE_REQUEST",
          title: "New Leave Request",
          message: `A new leave request has been submitted for ${startDate} to ${endDate}`,
          status: "PENDING",
          sourceId: session.user.id,
          targetId: admin.id
        }
      });
    });

    await Promise.all(notificationPromises);

    return NextResponse.json({
      message: "Leave request submitted successfully",
      leaveRequest
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to submit leave request" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== "Admin") {
      return NextResponse.json(
        { error: "Only admins can approve/reject leave requests" },
        { status: 403 }
      );
    }

    const data = await req.json();
    const { leaveRequestId, status, rejectionReason } = data;

    if (status === "REJECTED" && !rejectionReason) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      );
    }

    const leaveRequest = await db.leaveRequest.findUnique({
      where: { id: leaveRequestId },
      include: { employee: true }
    });

    if (!leaveRequest) {
      return NextResponse.json(
        { error: "Leave request not found" },
        { status: 404 }
      );
    }

    // Update leave request status and rejection reason if provided
    const updatedLeaveRequest = await db.leaveRequest.update({
      where: { id: leaveRequestId },
      data: {
        status,
        ...(status === "REJECTED" && { rejectionReason })
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true,
            profileImage: true
          }
        }
      }
    });

    // Create notification for employee
    await db.notification.create({
      data: {
        type: "LEAVE_REQUEST",
        title: "Leave Request Update",
        message: `Your leave request for ${leaveRequest.startDate} to ${leaveRequest.endDate} has been ${status.toLowerCase()}${status === "REJECTED" ? `: ${rejectionReason}` : ""}`,
        status: status === "APPROVED" ? "APPROVED" : "REJECTED",
        sourceId: session.user.id,
        targetId: leaveRequest.employeeId
      }
    });

    return NextResponse.json({
      message: "Leave request updated successfully",
      leaveRequest: updatedLeaveRequest
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update leave request" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const employeeId = searchParams.get("employeeId");

    let whereClause: any = {};
    
    if (user?.role === "Admin") {
      if (employeeId) {
        whereClause.employeeId = employeeId;
      }
    } else {
      whereClause.employeeId = session.user.id;
    }

    if (status) {
      whereClause.status = status;
    }

    const leaveRequests = await db.leaveRequest.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true,
            profileImage: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(leaveRequests);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch leave requests" },
      { status: 500 }
    );
  }
} 