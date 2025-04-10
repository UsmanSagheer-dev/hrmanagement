// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoptions";
import db from "../../../../lib/prismadb";


// Get all notifications with filtering options
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    // Determine if admin or regular user
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    // Build query condition based on role and filters
    const queryCondition: any = {};

    // Filter by type if specified
    if (type) {
      queryCondition.type = type;
    }

    // Filter by status if specified
    if (status) {
      queryCondition.status = status;
    }

    // Admin sees all notifications, regular users only see their own
    if (user?.role !== "Admin") {
      queryCondition.OR = [
        { targetId: session.user.id },
        { 
          employee: {
            id: session.user.id
          }
        }
      ];
    }

    const notifications = await db.notification.findMany({
      where: queryCondition,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true
          }
        }
      }
    });

    return NextResponse.json(notifications);
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// Update notification status (approve/reject employee)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== "Admin") {
      return NextResponse.json(
        { error: "Only admins can approve or reject requests" },
        { status: 403 }
      );
    }

    const { notificationId, action, read } = await req.json();

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    // Find the notification
    const notification = await db.notification.findUnique({
      where: { id: notificationId },
      include: {
        employee: true
      }
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    // Update notification based on action
    const updateData: any = {};

    // Handle read status if provided
    if (read !== undefined) {
      updateData.read = read;
    }

    // Handle approval actions if provided
    if (action === "approve" || action === "reject") {
      updateData.status = action === "approve" ? "APPROVED" : "REJECTED";
      
      // If this is an employee approval, update the User role
      if (notification.type === "EMPLOYEE_REQUEST" && notification.sourceId && action === "approve") {
        // Find the User associated with this employee
        const employee = await db.employee.findUnique({
          where: { id: notification.sourceId }
        });
        
        if (employee) {
          // Update the associated User record
          await db.user.update({
            where: { id: employee.id },
            data: { role: "Employee" }
          });
        }
      }
    }

    // Update the notification
    const updatedNotification = await db.notification.update({
      where: { id: notificationId },
      data: updateData,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(updatedNotification);
  } catch (error: any) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update notification" },
      { status: 500 }
    );
  }
}