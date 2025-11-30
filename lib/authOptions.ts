
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectDB from './mongodb';

const generateRandomCode = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

const comparePassword = async (plainPassword: string, hashedPassword: string) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (err) {
    return false
  }
};

interface User {
  email: string;
  password?: string;
};

const baseUrl = process.env.BASE_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter your email" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        await connectDB()
        const record = await User.findOne({ email: credentials.email });
        if (record) {
          const compare = await comparePassword(credentials.password, record.password);
          if (compare) {
            const user = {
              id: record._id.toString(),
              email: record.email,
            }
            return user
          } else {
            return null
          }
        } else {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/onboarding',
  },
  callbacks: {
    async signIn({ user, account }: { user: any, account: any }) {
      if (account.provider === 'google' || account.provider === "credentials") {
        const { email } = user;
        const userName = user.name || email.split('@')[0];
        try {
          await connectDB()
          const existing = await User.findOne({ email });
          if (!existing) {
            let firstName = '';
            let lastName = '';
            let image = '';
            let verified = false;

            if (account.provider === 'google' && user.image) {
              // image = user.image;
              verified = true
            }

            if (userName) {
              const nameParts = userName.trim().split(' ');
              firstName = nameParts[0] || '';
              if (nameParts.length > 1) {
                lastName = nameParts.slice(1).join(' ');
              }
            }
            const newUser = new User({
              name: userName,
              firstName: firstName,
              lastName: lastName,
              email: email,
              image: image,
              verified: verified
            })
            await newUser.save();
          } else {
            if (account.provider === 'google') {
              await User.findOneAndUpdate({ email }, { name: userName, verified: true });
              // await UserToken.deleteMany({ email });
            }
          }
          return true;
        } catch (error) {
          return false;
        }
      } else {
        return false; 
      }
    },

    async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
      if (url.includes('/api/auth/signout')) {
        return baseUrl;
      } else if (url === baseUrl) {
        return `${baseUrl}/`;
      } else if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },

    async jwt({ token, user, account }: { token: any, user: any, account: any }) {
      if (user) {
        token.email = user.email;
        token.accessToken = account.access_token;
      } 
      return token;
    },

    async session({ session, token }: { session: any, token: any }) {
      const email = token?.email as string;
      await connectDB();

      if (!email) return session;
      let dbUser = await User.findOne({ email: email });
      let constructedPlan: any;

      try {
        session.user = {
          ...session.user,
          email: dbUser.email,  
          name: dbUser.name || dbUser.email.split('@')[0],
          id: dbUser._id.toString() || "",
          // password: dbUser?.password || '',
          image: dbUser?.image || "",
          phone: dbUser?.phone || "",
          plan: dbUser?.plan || "",
          renewal: dbUser?.renewal || ""
        };
      } catch (error) {
        return session
      }
      return session;
    },
  },
};