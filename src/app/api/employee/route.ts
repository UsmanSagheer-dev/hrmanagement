import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoptions";
import db from "../../../../lib/prismadb";
import { uploadToCloudinary } from "@/app/utils/cloudinary";

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

    // Upload all files (including profileImage) to Cloudinary
    const documentUrls = {
      appointmentLetter: data.appointmentLetter
        ? await uploadToCloudinary(data.appointmentLetter)
        : null,
      salarySlips: data.salarySlips
        ? await uploadToCloudinary(data.salarySlips)
        : null,
      relievingLetter: data.relievingLetter
        ? await uploadToCloudinary(data.relievingLetter)
        : null,
      experienceLetter: data.experienceLetter
        ? await uploadToCloudinary(data.experienceLetter)
        : null,
      profileImage: data.profileImage
        ? await uploadToCloudinary(data.profileImage)
        : null, // Add profileImage upload
    };

    const formattedData = {
      firstName: data.firstName,
      lastName: data.lastName,
      mobileNumber: data.mobileNumber,
      email: data.email,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      maritalStatus: data.maritalStatus,
      gender: data.gender,
      nationality: data.nationality,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      profileImage: documentUrls.profileImage, // Use Cloudinary URL

      employeeId: data.employeeId,
      userName: data.userName,
      employeeType: data.employeeType,
      workEmail: data.workEmail,
      department: data.department,
      designation: data.designation,
      workingDays: data.workingDays,
      joiningDate: data.joiningDate ? new Date(data.joiningDate) : null,
      officeLocation: data.officeLocation,

      appointmentLetter: documentUrls.appointmentLetter,
      salarySlips: documentUrls.salarySlips,
      relievingLetter: documentUrls.relievingLetter,
      experienceLetter: documentUrls.experienceLetter,

      slackId: data.slackId,
      skypeId: data.skypeId,
      githubId: data.githubId,
    };

    const existingEmployee = await db.employee.findFirst({
      where: {
        OR: [
          { employeeId: formattedData.employeeId },
          { email: formattedData.email },
          { workEmail: formattedData.workEmail },
        ],
      },
    });

    if (existingEmployee) {
      return NextResponse.json(
        {
          error: "Employee with this ID or email already exists",
          field:
            existingEmployee.employeeId === formattedData.employeeId
              ? "employeeId"
              : "email",
        },
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

// GET function remains unchanged
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const employee = await db.employee.findUnique({
        where: { employeeId: id },
      });
      return NextResponse.json(employee);
    }

    const employees = await db.employee.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(employees);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
