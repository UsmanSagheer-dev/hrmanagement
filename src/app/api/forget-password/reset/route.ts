import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "../../../../../lib/prismadb";

const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  return phoneNumber.startsWith('+') ? phoneNumber : `+${cleaned}`;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phoneNumber, otp, newPassword } = body;

    if (!phoneNumber || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Phone number, OTP, and new password are required" },
        { status: 400 }
      );
    }

    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    if (!phoneRegex.test(formattedPhoneNumber)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const user = await db.user.findFirst({
      where: { phoneNumber: { equals: formattedPhoneNumber } },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    if (!user.resetPasswordToken || !user.resetPasswordExpires) {
      return NextResponse.json(
        { error: "No active password reset request found" },
        { status: 400 }
      );
    }

    if (user.resetPasswordToken !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    if (new Date() > user.resetPasswordExpires) {
      return NextResponse.json(
        { error: "OTP has expired" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await db.user.update({
      where: { id: user.id },
      data: {
        hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error in password reset:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}