import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "../../../../lib/prismadb";

export async function POST(req: Request) {
  try {

    const rawBody = await req.text();
    console.log("Raw request body:", rawBody);

    const body = JSON.parse(rawBody); 
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const userAlreadyExist = await db.user.findFirst({
      where: { email },
    });

    if (userAlreadyExist?.id) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await db.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (err: any) {
    console.log("REGISTER_ERR: ", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}