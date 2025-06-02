import { NextResponse } from "next/server";
import db from "../../../../lib/prismadb";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (phoneNumber: string, otp: string) => {
  try {
    const message = await client.messages.create({
      body: `Your HR Management System password reset OTP is: ${otp}. This OTP will expire in 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    console.log("SMS sent successfully:", message.sid);
    return true;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw new Error("Failed to send SMS. Please try again later.");
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: {
        phoneNumber: {
          equals: phoneNumber
        }
      },
    });

    if (!user) {
      // Return success even if user doesn't exist for security
      return NextResponse.json(
        { message: "If an account exists with this phone number, you will receive an OTP." },
        { status: 200 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    try {
      await db.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: otp,
          resetPasswordExpires: otpExpiry,
        },
      });

      await sendSMS(phoneNumber, otp);

      return NextResponse.json(
        { message: "If an account exists with this phone number, you will receive an OTP." },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error in password reset process:", error);
      return NextResponse.json(
        { error: "Failed to process password reset request. Please try again." },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("Error in forgot password:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
