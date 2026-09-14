import NextAuth, { type User as AuthUser, NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { prisma } from "./lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";

const adapter = PrismaAdapter(prisma);

const authOptions: NextAuthConfig = {
  ...authConfig,
  adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) {
          throw new Error("Please enter a valid email and password.");
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
          throw new Error("Invalid user credentials.");
        }

        const isPasswordMatch = await compare(password, user.password);
        if (!isPasswordMatch) throw new Error("Invalid email or password.");
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user, account }) => {
      if (!user || !user.email) return false;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
      if (existingUser) {
        await prisma.user.update({
          where: { email: user.email },
          data: { lastLogin: new Date() },
        });
        return true;
      }

      if (account?.provider === "google") {
        await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            image: user.image,
            Authenticator: "google",
            accounts: {
              create: {
                provider: "google",
                providerAccountId: account.providerAccountId,
                type: account.type,
                access_token: account.access_token,
                id_token: account.id_token,
              },
            },
          },
        });
        return true;
      }
      return false;
    },
    session: async ({ session, token }) => ({
      ...session,
      user: { ...session.user, id: token.sub },
    }),
    jwt: async ({ user, token }) => {
      if (user) token.sub = user.id;
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  debug: process.env.NODE_ENV !== "production",
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
