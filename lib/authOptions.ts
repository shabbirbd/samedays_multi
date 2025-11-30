import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectDB from './mongodb';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      email?: string;
      name?: string;
      image?: string;
      phone?: string;
      plan?: string;
      renewal?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
  }
}

const comparePassword = async (plainPassword: string, hashedPassword: string) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch {
    return false;
  }
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();
        const record = await User.findOne({ email: credentials.email });

        if (!record) return null;

        const match = await comparePassword(credentials.password, record.password);
        if (!match) return null;

        return {
          id: record._id.toString(),
          email: record.email,
          name: record.name || record.email.split('@')[0],
        };
      }
    })
  ],

  pages: {
    signIn: '/onboarding',
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === 'google' || account.provider === 'credentials') {
        const email = user.email;
        const userName = user.name || email.split('@')[0];

        await connectDB();
        const existing = await User.findOne({ email });

        if (!existing) {
          await User.create({
            name: userName,
            email: email,
            verified: account.provider === 'google',
          });
        } else if (account.provider === 'google') {
          await User.updateOne(
            { email },
            { verified: true, name: userName }
          );
        }

        return true;
      }

      return false;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      const email = token?.email;
      await connectDB();

      if (!email) return session;

      const dbUser = await User.findOne({ email });

      if (!dbUser) return session;

      session.user = {
        ...session.user,
        email: dbUser.email,
        name: dbUser.name || dbUser.email.split('@')[0],
        id: dbUser._id.toString(),
        image: dbUser.image || "",
        phone: dbUser.phone || "",
        plan: dbUser.plan || "",
        renewal: dbUser.renewal || "",
      };

      return session;
    }
  }
};
