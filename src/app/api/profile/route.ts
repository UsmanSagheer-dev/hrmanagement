import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoptions";
import db from "../../../../lib/prismadb";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary";

export const GET = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let user = null;

    if (session.user.id) {
      user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    if (!user && session.user.email) {
      user = await db.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const PUT = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { name, role, avatar } = await req.json();

    if (role && session.user.role !== "Admin") {
      return NextResponse.json(
        { error: "Not authorized to change role" },
        { status: 403 }
      );
    }

    let user = null;

    if (session.user.id) {
      user = await db.user.findUnique({
        where: { id: session.user.id },
      });
    }

    if (!user && session.user.email) {
      user = await db.user.findUnique({
        where: { email: session.user.email },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name) {
      updateData.name = name;
    }

    if (role && session.user.role === "Admin") {
      updateData.role = role;
    }

    if (avatar && avatar !== user.avatar) {
      try {
        const avatarUrl = await uploadToCloudinary(avatar);
        updateData.avatar = avatarUrl;

        if (user.avatar && user.avatar.includes("cloudinary.com")) {
          await deleteFromCloudinary(user.avatar);
        }
      } catch (err) {
        return NextResponse.json(
          { error: "Failed to upload avatar" },
          { status: 500 }
        );
      }
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const revalidate = 0;
