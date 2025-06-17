import { NextResponse } from "next/server";
import db from "../../../../lib/prismadb";
import twilio from "twilio";

// Initialize Twilio client only if credentials are available
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const formatPhoneNumber = (phoneNumber: string) => {
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // If number doesn't start with +, add it
  if (!phoneNumber.startsWith('+')) {
    return `+${cleaned}`;
  }
  
  return phoneNumber;
};

const sendSMS = async (phoneNumber: string, otp: string) => {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);

    // If Twilio is configured, use it to send SMS
    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      const message = await twilioClient.messages.create({
        body: `Your HR Management System password reset OTP is: ${otp}. This OTP will expire in 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedNumber,
      });
      console.log("SMS sent successfully:", message.sid);
    } else {
      // In development mode, just log the OTP
      console.log("Development Mode - OTP for", formattedNumber, ":", otp);
      console.log("To enable SMS sending, configure Twilio credentials in .env file");
    }
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

    // Format phone number
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    if (!phoneRegex.test(formattedPhoneNumber)) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: {
        phoneNumber: {
          equals: formattedPhoneNumber
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

    // Check if there's an existing OTP that hasn't expired
    if (user.resetPasswordToken && user.resetPasswordExpires && new Date() < user.resetPasswordExpires) {
      return NextResponse.json(
        { error: "An OTP has already been sent. Please wait for it to expire or try again later." },
        { status: 400 }
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

      await sendSMS(formattedPhoneNumber, otp);

      return NextResponse.json(
        { 
          message: "If an account exists with this phone number, you will receive an OTP.",
          // In development mode, include OTP in response
          ...(process.env.NODE_ENV === "development" && { debugOtp: otp })
        },
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
