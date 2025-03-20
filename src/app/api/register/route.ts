import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "../../../../lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!name ||!email || !password) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const userAlreadyExist = await db.user.findFirst({
      where: { email },
    });

    if (userAlreadyExist?.id) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with "Employee" role by default
    // First user in system could be made admin automatically (optional)
    const userCount = await db.user.count();
    const isFirstUser = userCount === 0;

    const newUser = await db.user.create({
      data: {
        email,
        name: name,
        hashedPassword,
        role: isFirstUser ? "Admin" : "Employee" // First user becomes Admin, others Employee
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