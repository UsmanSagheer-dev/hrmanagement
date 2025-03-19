import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prismadb from "./prismadb";
import bcrypt from "bcryptjs";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  hashedPassword: string | null; 
  role?: string | null; 
  emailVerified?: Date | null;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

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
};