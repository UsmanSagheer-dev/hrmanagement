import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client"; 
import { DefaultSession } from "next-auth"; // Added DefaultSession import

const prisma = new PrismaClient(); 

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      avatar?: string | null; // Added avatar property to match authoptions.tsx
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string; // Ensure userId is explicitly typed as string
    role?: string;
  }
}

export const { signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Github({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
        session.user.id = token.userId as string; 
      }
      return session;
    }
  }
});