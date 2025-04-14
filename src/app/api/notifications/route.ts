import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoptions";
import db from "../../../../lib/prismadb";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const read = searchParams.get("read");
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const queryCondition: any = {};

    if (type) {
      queryCondition.type = type;
    }

    if (status) {
      queryCondition.status = status;
    }

    if (read !== null) {
      queryCondition.read = read === "true" ? true : false;
    }

    if (user?.role !== "Admin") {
      queryCondition.OR = [
        { targetId: session.user.id },
        {
          employee: {
            id: session.user.id,
          },
        },
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
            profileImage: true,
          },
        },
      },
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

    const notification = await db.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    const updateData: any = {};

    if (read !== undefined) {
      updateData.read = read;
    }

    if (action === "approve" || action === "reject") {
      updateData.status = action === "approve" ? "APPROVED" : "REJECTED";

      if (notification.type === "EMPLOYEE_REQUEST" && notification.sourceId) {
        const pendingEmployee = await db.pendingEmployee.findUnique({
          where: { id: notification.sourceId },
        });

        if (pendingEmployee) {
          const userId = pendingEmployee.userId;

          if (action === "approve") {
            await db.employee.create({
              data: {
                id: userId,
                firstName: pendingEmployee.firstName,
                lastName: pendingEmployee.lastName,
                mobileNumber: pendingEmployee.mobileNumber,
                email: pendingEmployee.email,
                dateOfBirth: pendingEmployee.dateOfBirth,
                maritalStatus: pendingEmployee.maritalStatus,
                gender: pendingEmployee.gender,
                nationality: pendingEmployee.nationality,
                address: pendingEmployee.address,
                city: pendingEmployee.city,
                state: pendingEmployee.state,
                zipCode: pendingEmployee.zipCode,
                profileImage: pendingEmployee.profileImage,

                employeeId: pendingEmployee.employeeId,
                userName: pendingEmployee.userName,
                employeeType: pendingEmployee.employeeType,
                workEmail: pendingEmployee.workEmail,
                department: pendingEmployee.department,
                designation: pendingEmployee.designation,
                workingDays: pendingEmployee.workingDays,
                joiningDate: pendingEmployee.joiningDate,
                officeLocation: pendingEmployee.officeLocation,

                appointmentLetter: pendingEmployee.appointmentLetter,
                salarySlips: pendingEmployee.salarySlips,
                relievingLetter: pendingEmployee.relievingLetter,
                experienceLetter: pendingEmployee.experienceLetter,

                slackId: pendingEmployee.slackId,
                skypeId: pendingEmployee.skypeId,
                githubId: pendingEmployee.githubId,
              },
            });

            await db.user.update({
              where: { id: userId },
              data: { role: "Employee" },
            });
          } else {
            await db.user.update({
              where: { id: userId },
              data: { role: "User" },
            });
          }

          await db.pendingEmployee.delete({
            where: { id: pendingEmployee.id },
          });
        }
      }
    }

    const updatedNotification = await db.notification.update({
      where: { id: notificationId },
      data: updateData,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
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
