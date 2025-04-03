import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import db from "./prismadb";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string | null;
    role: string;
    avatar?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: string;
      avatar?: string | null;
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

        const isValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || "user",
          avatar: user.avatar,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "user",
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await db.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            // Create new user for Google auth
            const newUser = await db.user.create({
              data: {
                email: user.email,
                name: user.name,
                role: "user",
                avatar: user.image,
              },
            });
            // Update the user object with the database ID
            user.id = newUser.id;
          } else {
            // Update the user object with the database ID
            user.id = existingUser.id;
            // Update avatar if needed
            if (user.image && user.image !== existingUser.avatar) {
              await db.user.update({
                where: { id: existingUser.id },
                data: {
                  avatar: user.image,
                },
              });
            }
          }
        } catch (error) {
          console.error("Google auth error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // When signIn is called
      if (user) {
        // For Google auth, we need to ensure we're using the database ID
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.avatar = user.image || user.avatar;
        
        // Add a log to debug
        console.log("JWT callback - token ID set to:", token.id);
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Always fetch fresh user data from the database
        const dbUser = await db.user.findUnique({
          where: { 
            // First try by ID if available
            ...(token.id ? { id: token.id as string } : {}),
            // Fall back to email if ID is not available
            ...(token.id ? {} : { email: token.email as string }),
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            avatar: true,
          },
        });

        if (dbUser) {
          session.user = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role || "user",
            avatar: dbUser.avatar,
          };
          
          console.log("Session callback - user ID set to:", session.user.id);
        } else {
          console.error("No database user found for token:", token);
        }
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};