import { NextResponse } from "next/server";
import db from "../../../../lib/prismadb";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const sendEmail = async (email: string, otp: string) => {
  console.log(`Sending OTP ${otp} to ${email}`);

};

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: "If email exists, OTP will be sent" },
        { status: 200 }
      );
    }


    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry


    await db.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: otp,
        resetPasswordExpires: otpExpiry,
      },
    });

    // Send OTP via email
    await sendEmail(email, otp);

    return NextResponse.json(
      { message: "If email exists, OTP will be sent" },
      { status: 200 }
    );
  } catch (err: any) {
    console.log("FORGOT_PASSWORD_ERR: ", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}