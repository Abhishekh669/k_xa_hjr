import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentailsProvider from "next-auth/providers/credentials";
import { connectDB } from "./lib/connectDB";
import { User } from "./model/user.model";
import { compare } from "bcryptjs";
import { authConfig } from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  
  ...authConfig,
  providers: [
    CredentailsProvider({
      async authorize(credentials) {
        if (credentials == null) return null;
        try {
          await connectDB();
          const user = await User.findOne({
            $and: [
              { email: credentials.email },
              { authProvider: credentials.authProvider },
            ],
          }).select("+password");
          if (!user) {
            throw new Error("User not found ");
          }
          const isMatch = await compare(
            credentials.password as string,
            user.password
          );
          if (!isMatch) {
            throw new Error("Invalid Username or Password");
          }
          const data = {
            _id: user._id,
            email: user.email,
            name: user.name,
            authProvider: "credentials",
          };
          return data;
        } catch (err) {
          throw new Error(err as string);
        }
      },
    }) ,
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({user, account}){
      if(account?.provider !== "credentials") return true;
      const  existingUser = await User.findOne({_id : user._id});
      if(!existingUser?.emailVerified) return false;
      return true 
    },
    async jwt({ token, user, account }) {
      if (user) {
        token._id = user._id?.toString();
        token.name = user.name;
        token.email = user.email;
        token.authProvider = user.authProvider || account?.provider; // Store the provider (google, github, credentials)
      }
      return token;
    },
    async session({ session, token }) {
        if(!token) throw new Error("Something went wrong")
        session.user._id = token._id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.authProvider = token.authProvider as string;
        await connectDB();
        let checkUser = await User.findOne({
          $and: [
            { email: session.user.email },
            { authProvider: session.user.authProvider },
          ],
        });
        if (!checkUser) {
          const newUser = {
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            authProvider: session.user.authProvider as string,
            emailVerified : new Date()
          };
          const newDbUser = new User(newUser);
          const savedUser = await newDbUser.save();
          if (!savedUser) {
            throw new Error("Failed to create user");
          }
          session.user._id = savedUser._id.toString()
          return session;
        }
        session.user._id = checkUser._id.toString();
      return session;

    },
  },
  secret: process.env.AUTH_SECRET,
});
