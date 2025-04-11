import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoptions";
import db from "../../../../lib/prismadb";
import { uploadToCloudinary } from "@/app/utils/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const data = await req.json();

    const profileImageUrl = data.profileImage
      ? await uploadToCloudinary(data.profileImage)
      : null;

    const documentUploads = Object.entries(data.documents || {})
      .filter(([_, value]) => value !== null)
      .map(async ([key, value]) => {
        try {
          const url = await uploadToCloudinary(value as string);
          return { key, url };
        } catch (error) {
          console.error(`Error uploading ${key}:`, error);
          return { key, url: null, error };
        }
      });

    const uploadResults = await Promise.all(documentUploads);

    const documentUrls = uploadResults.reduce((acc, { key, url }) => {
      if (url) acc[key] = url;
      return acc;
    }, {} as Record<string, string>);

    const failedUploads = uploadResults.filter((result) => !result.url);
    if (failedUploads.length > 0) {
      const failedDocs = failedUploads.map((f) => f.key).join(", ");
      console.error(`Failed to upload documents: ${failedDocs}`);
    }

    // Check if this user already has a pending employee record
    const existingPendingEmployee = await db.pendingEmployee.findUnique({
      where: { userId: session.user.id },
    });

    if (existingPendingEmployee) {
      return NextResponse.json(
        { error: "You already have a pending employee request" },
        { status: 409 }
      );
    }

    // Check if user is already an employee
    const existingEmployee = await db.employee.findUnique({
      where: { id: session.user.id },
    });

    if (existingEmployee) {
      return NextResponse.json(
        { error: "An employee record already exists for this user" },
        { status: 409 }
      );
    }

    // Check for duplicates in Employee table
    const duplicateCheck = await db.employee.findFirst({
      where: {
        OR: [
          { employeeId: data.employeeId },
          { email: data.email },
          { workEmail: data.workEmail },
        ],
      },
    });

    if (duplicateCheck) {
      let field = "unknown";
      if (duplicateCheck.employeeId === data.employeeId)
        field = "employeeId";
      else if (duplicateCheck.email === data.email) field = "email";
      else if (duplicateCheck.workEmail === data.workEmail)
        field = "workEmail";

      return NextResponse.json(
        {
          error: "Employee with this ID or email already exists",
          field,
        },
        { status: 409 }
      );
    }

    // Prepare data for PendingEmployee
    const pendingEmployeeData = {
      userId: session.user.id,
      firstName: data.firstName,
      lastName: data.lastName,
      mobileNumber: data.mobileNumber,
      email: data.email,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      maritalStatus: data.maritalStatus,
      gender: data.gender,
      nationality: data.nationality,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      profileImage: profileImageUrl,

      employeeId: data.employeeId,
      userName: data.userName,
      employeeType: data.employeeType,
      workEmail: data.workEmail,
      department: data.department,
      designation: data.designation,
      workingDays: data.workingDays,
      joiningDate: data.joiningDate ? new Date(data.joiningDate) : undefined,
      officeLocation: data.officeLocation,

      appointmentLetter: documentUrls.appointmentLetter || null,
      salarySlips: documentUrls.salarySlips || null,
      relievingLetter: documentUrls.relievingLetter || null,
      experienceLetter: documentUrls.experienceLetter || null,

      slackId: data.slackId,
      skypeId: data.skypeId,
      githubId: data.githubId,
    };

    // Save to PendingEmployee table
    const pendingEmployee = await db.pendingEmployee.create({
      data: pendingEmployeeData,
    });

    // Find admin users to notify
    const adminUsers = await db.user.findMany({
      where: { role: "Admin" },
      select: { id: true },
    });

    if (adminUsers.length > 0) {
      const notificationPromises = adminUsers.map((admin) => {
        return db.notification.create({
          data: {
            type: "EMPLOYEE_REQUEST",
            title: "New Employee Registration",
            message: `${data.firstName} ${data.lastName} has submitted employee information for approval`,
            status: "PENDING",
            sourceId: pendingEmployee.id, // Use the pendingEmployee id
            targetId: admin.id,
          },
        });
      });

      await Promise.all(notificationPromises);
    }

    // Update user role to Pending
    await db.user.update({
      where: { id: session.user.id },
      data: { role: "Pending" },
    });

    return NextResponse.json(
      {
        message: "Employee data submitted successfully and sent for approval",
        pendingEmployee,
        pendingApproval: true,
        uploadStats: {
          total: documentUploads.length + (profileImageUrl ? 1 : 0),
          succeeded:
            (profileImageUrl ? 1 : 0) +
            uploadResults.filter((r) => r.url).length,
          failed: failedUploads.length,
        },
      },
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
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const employee = await db.employee.findUnique({
        where: { id },
      });

      if (!employee) {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(employee);
    }

    const employees = await db.employee.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(employees);
  } catch (error: any) {
    console.error("Error fetching employee data:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch employee data" },
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
        { error: "Only administrators can delete employee records" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    const employee = await db.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    await db.notification.deleteMany({
      where: { OR: [{ sourceId: id }, { targetId: id }] },
    });

    await db.employee.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete employee" },
      { status: 500 }
    );
  }
}


