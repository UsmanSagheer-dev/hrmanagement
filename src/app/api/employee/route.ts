import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoptions";
import db from "../../../../lib/prismadb";
import { uploadToCloudinary } from "@/app/utils/cloudinary";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Parse request data
    const data = await req.json();

    // Upload profile image
    const profileImageUrl = data.profileImage
      ? await uploadToCloudinary(data.profileImage)
      : null;

    // Upload documents to Cloudinary in parallel
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

    // Wait for all uploads to complete
    const uploadResults = await Promise.all(documentUploads);

    // Build document URLs object
    const documentUrls = uploadResults.reduce((acc, { key, url }) => {
      if (url) acc[key] = url;
      return acc;
    }, {} as Record<string, string>);

    // Check for any failed uploads
    const failedUploads = uploadResults.filter(result => !result.url);
    if (failedUploads.length > 0) {
      const failedDocs = failedUploads.map(f => f.key).join(', ');
      console.error(`Failed to upload documents: ${failedDocs}`);
    }

    // Format data for database
    const formattedData = {
      id: session.user.id,
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
      profileImage: profileImageUrl,

      employeeId: data.employeeId,
      userName: data.userName,
      employeeType: data.employeeType,
      workEmail: data.workEmail,
      department: data.department,
      designation: data.designation,
      workingDays: data.workingDays,
      joiningDate: data.joiningDate ? new Date(data.joiningDate) : null,
      officeLocation: data.officeLocation,

      // Document URLs
      appointmentLetter: documentUrls.appointmentLetter || null,
      salarySlips: documentUrls.salarySlips || null,
      relievingLetter: documentUrls.relievingLetter || null,
      experienceLetter: documentUrls.experienceLetter || null,

      slackId: data.slackId,
      skypeId: data.skypeId,
      githubId: data.githubId,
    };

    // Check if employee already exists for this user
    const existingEmployee = await db.employee.findUnique({
      where: { id: session.user.id },
    });

    if (existingEmployee) {
      return NextResponse.json(
        { error: "An employee record already exists for this user" },
        { status: 409 }
      );
    }

    // Check for duplicate records
    const duplicateCheck = await db.employee.findFirst({
      where: {
        OR: [
          { employeeId: formattedData.employeeId },
          { email: formattedData.email },
          { workEmail: formattedData.workEmail },
        ],
      },
    });

    if (duplicateCheck) {
      // Determine which field caused the duplicate
      let field = "unknown";
      if (duplicateCheck.employeeId === formattedData.employeeId) field = "employeeId";
      else if (duplicateCheck.email === formattedData.email) field = "email";
      else if (duplicateCheck.workEmail === formattedData.workEmail) field = "workEmail";

      return NextResponse.json(
        {
          error: "Employee with this ID or email already exists",
          field,
        },
        { status: 409 }
      );
    }

    // Create employee record
    const employee = await db.employee.create({
      data: formattedData,
    });

    return NextResponse.json(
      { 
        message: "Employee data saved successfully", 
        employee,
        uploadStats: {
          total: documentUploads.length + (profileImageUrl ? 1 : 0),
          succeeded: (profileImageUrl ? 1 : 0) + uploadResults.filter(r => r.url).length,
          failed: failedUploads.length
        }
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
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Get single employee if ID is provided
    if (id) {
      const employee = await db.employee.findUnique({
        where: { id },
      });
      
      if (!employee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 });
      }
      
      return NextResponse.json(employee);
    }

    // Get all employees
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