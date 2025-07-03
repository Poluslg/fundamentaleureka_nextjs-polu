import NextAuth, {
  type User as AuthUser,
  NextAuthConfig,
  AuthError,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { prisma } from "./lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

const adapter = PrismaAdapter(prisma);

const authOptions: NextAuthConfig = {
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
        try {
          const email = credentials?.email as string | undefined;
          const password = credentials?.password as string | undefined;
          if (!email || !password) {
            throw new Error("Please enter a valid email and password.");
          }

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) throw new Error("Invalid user credentials.");

          if (!user.password) throw new Error("Please set a password.");

          const isPasswordMatch = await compare(
            password,
            user.password as string
          );
          if (!isPasswordMatch) throw new Error("Invalid email or password.");
          return { name: user.name, email: user.email };
        } catch (error) {
          throw new Error("Unable to proceed, Please try after some time.");
        }
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
        // return true;
        await prisma.user.update({
          where: {
            email: user.email,
          },
          data: {
            lastLogin: new Date(),
          }
        })
        return true;
      } else {
        //   if (account?.provider === "google") {
        //     // Link Google account to existing user
        //     await prisma.account.upsert({
        //       where: {
        //         provider_providerAccountId: {
        //           provider: "google",
        //           providerAccountId: account.providerAccountId,
        //         },
        //       },
        //       update: {},
        //       create: {
        //         userId: existingUser.id,
        //         provider: "google",
        //         providerAccountId: account.providerAccountId,
        //         type: account.type,
        //         access_token: account.access_token,
        //         id_token: account.id_token,
        //       },
        //     });
        //   }
        //   return true;
        // } else {
        // Create a new user if it doesn't exist
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
      }
      return false;
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub, // Ensure user ID is included in the session
        },
      };
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/signup",
    // error: "/auth/error",
  },
  secret: process.env.AUTH_SECRET,
  // debug: process.env.NODE_ENV !== "production",
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
