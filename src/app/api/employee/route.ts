import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoptions";
import db from "../../../../lib/prismadb";
import { uploadToCloudinary } from "@/app/utils/cloudinary";

function isValidObjectId(id: string | null): id is string {
  if (!id) return false;
  return /^[a-fA-F0-9]{24}$/.test(id);
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
          return { key, url: null, error };
        }
      });

    const uploadResults = await Promise.all(documentUploads);

    const documentUrls = uploadResults.reduce((acc, { key, url }) => {
      if (url) acc[key] = url;
      return acc;
    }, {} as Record<string, string>);

    const failedUploads = uploadResults.filter((result) => !result.url);

    const existingPendingEmployee = await db.pendingEmployee.findUnique({
      where: { userId: session.user.id },
    });

    if (existingPendingEmployee) {
      return NextResponse.json(
        { error: "You already have a pending employee request" },
        { status: 409 }
      );
    }

    const existingEmployee = await db.employee.findUnique({
      where: { id: session.user.id },
    });

    if (existingEmployee) {
      return NextResponse.json(
        { error: "An employee record already exists for this user" },
        { status: 409 }
      );
    }

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
      if (duplicateCheck.employeeId === data.employeeId) field = "employeeId";
      else if (duplicateCheck.email === data.email) field = "email";
      else if (duplicateCheck.workEmail === data.workEmail) field = "workEmail";

      return NextResponse.json(
        {
          error: "Employee with this ID or email already exists",
          field,
        },
        { status: 409 }
      );
    }

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

    const pendingEmployee = await db.pendingEmployee.create({
      data: pendingEmployeeData,
    });

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
            sourceId: pendingEmployee.id,
            targetId: admin.id,
          },
        });
      });

      await Promise.all(notificationPromises);
    }

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
    const department = searchParams.get("department");

    if (id) {
      // Normalize the incoming id (decode + trim) — sometimes front-end
      // values contain extra whitespace or encoding.
      const rawId = decodeURIComponent(id).trim();

      // Dev-time diagnostics: log the incoming id and the requesting user.
      // eslint-disable-next-line no-console
      console.debug("/api/employee GET - incoming id:", { rawId, requester: session.user.id });

      // Support finding by MongoDB ObjectId (the primary `id`) or by the
      // human-readable `employeeId` (e.g. "EMP001"). If the provided `id`
      // looks like an ObjectId use it against the `id` field; otherwise look
      // up `employeeId` (try exact match first, then fallback to a
      // case-insensitive-like contains search as a last resort).
      let employee = null;

      if (isValidObjectId(rawId)) {
        // incoming value looks like an ObjectId; try lookup by primary id
        employee = await db.employee.findUnique({ where: { id: rawId } });
        // eslint-disable-next-line no-console
        console.debug("/api/employee GET - looked up by ObjectId, found:", !!employee);
      }

      if (!employee) {
        // Try exact employeeId match (employeeId is unique in schema)
        try {
          employee = await db.employee.findUnique({ where: { employeeId: rawId } });
        } catch (e) {
          // ignore and continue to fallback
        }

        // If not found, try common case variations in case the stored value has
        // different casing (EMP001 vs emp001). These are cheap checks.
        if (!employee) {
          try {
            employee = await db.employee.findUnique({ where: { employeeId: rawId.toUpperCase() } });
          } catch (e) {
            // ignore
          }
        }

        if (!employee) {
          try {
            employee = await db.employee.findUnique({ where: { employeeId: rawId.toLowerCase() } });
          } catch (e) {
            // ignore
          }
        }

        // If the incoming id looks like an email, also try matching email/workEmail
        if (!employee && rawId.includes("@")) {
          try {
            employee = await db.employee.findFirst({
              where: {
                OR: [{ email: rawId }, { workEmail: rawId }],
              },
            });
          } catch (e) {
            // ignore
          }
        }

        // Debug whether exact/cased/email fallbacks found a result
        // eslint-disable-next-line no-console
        console.debug("/api/employee GET - exact/case/email fallback found:", !!employee);
      }

      if (!employee) {
        // Fallback: attempt a case-insensitive-ish search using findMany
        // and regex-like contains. This is more permissive and helps when
        // formatting differs (e.g., extra spaces or different casing).
        const candidates = await db.employee.findMany({
          where: {
            employeeId: { contains: rawId },
          },
          take: 1,
        });
        if (candidates && candidates.length > 0) {
          employee = candidates[0];
        }
      }

      if (!employee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 });
      }

      return NextResponse.json(employee);
    }

    if (department) {
      const employees = await db.employee.findMany({
        where: { department },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(employees);
    }

    const employees = await db.employee.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(employees);
  } catch (error: any) {
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

    // Support deleting by ObjectId or by human-readable employeeId
    const rawId = decodeURIComponent(id).trim();
    let employee = null;
    if (isValidObjectId(rawId)) {
      employee = await db.employee.findUnique({ where: { id: rawId } });
    }
    if (!employee) {
      try {
        employee = await db.employee.findUnique({ where: { employeeId: rawId } });
      } catch (e) {
        // continue
      }
    }

  if (!employee) {
  console.error("/api/employee GET - Employee not found:", {
    searchedId: rawId,
    wasObjectId: isValidObjectId(rawId),
    requesterId: session.user.id
  });
  
  return NextResponse.json(
    { 
      error: "Employee not found",
      details: {
        searchedId: rawId,
        suggestion: "Verify the employee exists in the database. Check the employeeId format."
      }
    },
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
    return NextResponse.json(
      { error: error.message || "Failed to delete employee" },
      { status: 500 }
    );
  }
}
