import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import db from "./prismadb";


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

        try {
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
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error("Authentication failed");
        }
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
            where: { email: user.email },
          });

          if (!existingUser) {
            const newUser = await db.user.create({
              data: {
                email: user.email,
                name: user.name,
                role: "user",
                avatar: user.image,
              },
            });
            user.id = newUser.id; // Assign database ID
            console.log("New Google user created with ID:", newUser.id);
          } else {
            user.id = existingUser.id; // Use existing database ID
            if (user.image && user.image !== existingUser.avatar) {
              await db.user.update({
                where: { id: existingUser.id },
                data: { avatar: user.image },
              });
              console.log("Updated avatar for user:", existingUser.id);
            }
          }
          return true;
        } catch (error) {
          console.error("Google signIn error:", error);
          return false;
        }
      }
      return true; // Credentials sign-in
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.avatar = user.avatar || user.image;
        console.log("JWT token updated:", token);
      }
      return token;
    },
    async session({ session, token }) {
      try {
        if (token?.id) {
          const dbUser = await db.user.findUnique({
            where: { id: token.id as string },
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
            console.log("Session updated with user:", session.user);
          } else {
            console.error("No user found in DB for token ID:", token.id);
            // Fallback to token data if DB fails
            session.user = {
              id: token.id as string,
              email: token.email as string,
              name: token.name || null,
              role: (token.role as string) || "user",
              avatar: token.avatar || null,
            };
          }
        } else {
          console.error("No token.id available:", token);
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        throw new Error("Failed to update session");
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
};
