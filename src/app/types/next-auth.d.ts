import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the default User type
declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string; // Add role to User type
    id: string;    // Ensure id is included if not already
  }

  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"]; // Extend session.user with role and id
  }
}


declare module "next-auth/jwt" {
  interface JWT {
    role?: string; // Add role to JWT
    id: string;    // Ensure id is included
  }
}