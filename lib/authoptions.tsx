import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prismadb from "./prismadb";
import bcrypt from "bcryptjs";
import {User} from '../src/app/types/types'

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prismadb.user.findFirst({
          where: {
            email: credentials.email,
          },
        }) as User;

        if (!user || !user.id || !user.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        const correctPassword = await bcrypt.compare(
          credentials.password, 
          user.hashedPassword 
        );

        if (!correctPassword) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV !== "production",
  // Added callbacks
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // ڈیٹابیس سے رول لے کر JWT میں شامل کریں
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};