import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string; 
    id: string;  
  }

  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }
}


declare module "next-auth/jwt" {
  interface JWT {
    role?: string; // Add role to JWT
    id: string;    // Ensure id is included
  }
}