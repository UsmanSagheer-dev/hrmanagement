import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "../../../../lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const userAlreadyExist = await db.user.findFirst({
      where: { email },
    });

    if (userAlreadyExist?.id) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userCount = await db.user.count();
    const isFirstUser = userCount === 0;

    const newUser = await db.user.create({
      data: {
        email,
        name,
        hashedPassword,
        role: isFirstUser ? "Admin" : "Employee",
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

export async function GET(req: Request) {
  try {
    const adminUser = await db.user.findFirst({
      where: {
        role: "Admin",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: "No admin user found" },
        { status: 404 }
      );
    }

    return NextResponse.json(adminUser, { status: 200 });
  } catch (err: any) {
    console.log("GET_ADMIN_ERR: ", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    const adminUser = await db.user.findFirst({
      where: { role: "Admin" },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: "No admin user found" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.hashedPassword = await bcrypt.hash(password, 12);

    const updatedUser = await db.user.update({
      where: { id: adminUser.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (err: any) {
    console.log("UPDATE_ADMIN_ERR: ", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const adminUser = await db.user.findFirst({
      where: { role: "Admin" },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: "No admin user found" },
        { status: 404 }
      );
    }

    await db.user.delete({
      where: { id: adminUser.id },
    });

    return NextResponse.json(
      { message: "Admin user deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.log("DELETE_ADMIN_ERR: ", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
