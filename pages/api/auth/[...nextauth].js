import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "E-mail/Password",
      credentials: {
        role: {
          type: "text",
        },
        name: {
          label: "name",
          type: "text",
        },
        email: {
          label: "E-mail",
          type: "email",
          placeholder: "E-mail",
        },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            ruby: user.ruby,
            birthday: user.birthday,
            gender: user.gender,
            address: user.address,
            tel: user.tel,
            graduation: user.graduation,
            spouse: user.spouse,
          };
        } else {
          throw new Error("Invalid email and/or password");
        }
      },
    }),
    // EmailProvider({
    //   server: {
    //     host: process.env.EMAIL_SERVER_HOST,
    //     port: process.env.EMAIL_SERVER_PORT,
    //     auth: {
    //       user: process.env.EMAIL_SERVER_USER,
    //       pass: process.env.EMAIL_SERVER_PASSWORD,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
  ],
  callbacks: {
    async session({ session, token }) {
      const user = await prisma.user.findUnique({
        where: {
          email: token.email,
        },
        include: {
          companies: true,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      session.user.id = user.id;
      session.user.role = user.role;
      session.user.image = user.image;
      session.user.companies = user.companies;
      session.user.ruby = user.ruby;
      session.user.birthday = user.birthday;
      session.user.gender = user.gender;
      session.user.address = user.address;
      session.user.tel = user.tel;
      session.user.graduation = user.graduation;
      session.user.spouse = user.spouse;

      return session;
    },
    // async redirect({ baseUrl }) {
    //   return baseUrl;
    // },
    async jwt({ token, user, trigger, account, profile, isNewUser }) {
      if (trigger === "update" && user) {
        token.name = user.name;
      }
      if (account) token.accessToken = account.access_token;
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
};
export default NextAuth(authOptions);
