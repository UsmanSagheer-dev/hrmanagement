
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authoptions";
import db from "../../../../lib/prismadb";
import cloudinary, { uploadToCloudinary, deleteFromCloudinary } from "../../utils/cloudinary";

export const GET = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" }, 
        { status: 401 }
      );
    }

    // Debug logging
    console.log("GET /api/profile - Session:", {
      id: session.user.id,
      email: session.user.email
    });
    
    // First try finding by ID
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
    
    // If no user found by ID, try by email (for Google auth)
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
      console.error("User not found for:", { 
        id: session.user.id, 
        email: session.user.email 
      });
      
      return NextResponse.json(
        { error: "User not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("PROFILE_FETCH_ERROR:", error);
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

    // Debug logging
    console.log("PUT /api/profile - Session:", {
      id: session.user.id,
      email: session.user.email
    });

    const { name, role, avatar } = await req.json();

    if (role && session.user.role !== "Admin") {
      return NextResponse.json(
        { error: "Not authorized to change role" },
        { status: 403 }
      );
    }

    // First find the user to ensure they exist
    let user = null;
    if (session.user.id) {
      user = await db.user.findUnique({
        where: { id: session.user.id },
      });
    }
    
    // If not found by ID, try email (for Google auth)
    if (!user && session.user.email) {
      user = await db.user.findUnique({
        where: { email: session.user.email },
      });
    }
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (name) {
      updateData.name = name;
    }
    
    if (role && session.user.role === "Admin") {
      updateData.role = role;
    }

    // Handle avatar upload if provided and changed
    if (avatar && avatar !== user.avatar) {
      try {
        console.log("Uploading new avatar to Cloudinary");
        
        // Upload new avatar to Cloudinary
        const avatarUrl = await uploadToCloudinary(avatar);
        updateData.avatar = avatarUrl;
        
        // Delete the old avatar from Cloudinary if it exists
        if (user.avatar && user.avatar.includes('cloudinary.com')) {
          console.log("Deleting old avatar from Cloudinary");
          await deleteFromCloudinary(user.avatar);
        }
      } catch (err) {
        console.error("Avatar upload error:", err);
        return NextResponse.json(
          { error: "Failed to upload avatar" },
          { status: 500 }
        );
      }
    }

    // Now update the user with the found ID
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
    console.error("PROFILE_UPDATE_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

// Disable caching for this API route
export const revalidate = 0;