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
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: { email },
    });

    if (!user || !user.hashedPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Exclude hashedPassword but include role in the response
    const { hashedPassword, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (err: any) {
    console.log("LOGIN_ERR: ", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}