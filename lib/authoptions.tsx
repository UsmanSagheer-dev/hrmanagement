import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "./prismadb";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      avatar?: string | null;
    } & DefaultSession["user"];
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
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            avatar: true,
            hashedPassword: true,
          },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || "user",
          avatar: user.avatar,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name || null,
          role: (token.role as string) || "user",
          avatar: (token.avatar as string | null) || null, // Explicit cast
        };
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

if (!process.env.NEXTAUTH_SECRET) {
  // Helpful runtime warning so developers don't accidentally run without a stable secret.
  // NEXTAUTH_SECRET is required for JWT session encryption/decryption. If it changes while
  // there are active sessions, decryption will fail with JWEDecryptionFailed.
  // Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  // and place it in your .env.local as NEXTAUTH_SECRET.
  // See: https://next-auth.js.org/configuration/options#secret
  // This warning is intentionally non-fatal so dev servers still run.
  // eslint-disable-next-line no-console
  console.warn(
    "WARNING: NEXTAUTH_SECRET is not set. Set a stable NEXTAUTH_SECRET in your environment to avoid session decryption errors."
  );
}