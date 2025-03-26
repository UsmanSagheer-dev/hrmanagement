import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import db from "./prismadb";

declare module "next-auth" {
  interface User {
    id: string;
    email: string | null;
    name: string | null;
    role: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string | null;
      name: string | null;
      role: string | null;
    };
  }
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
          throw new Error("Email and password are required");
        }
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials");
        }
        const isValid = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!isValid) throw new Error("Invalid password");
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile", // Explicitly request profile scope
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
async signIn({ user, account }) {
  if (account?.provider === "google") {
    try {
      const existingUser = await db.user.findUnique({
        where: { email: user.email! },
      });
      
      if (!existingUser) {
        // Create new user with Google details
        const newUser = await db.user.create({
          data: {
            email: user.email!,
            name: user.name!,
            role: "user",
            image: user.image || null, // Save Google profile image
          },
        });
      } else {
        // Update user's image if not already set
        if (!existingUser.image && user.image) {
          await db.user.update({
            where: { email: user.email! },
            data: { image: user.image },
          });
        }
      }
    } catch (error) {
      console.error("Error creating/updating user in MongoDB:", error);
      return false;
    }
  }
  return true;
},
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
       token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.image = token.image as string; // Add image to session
      }
      return session;
    },
  },
  debug: true,
};