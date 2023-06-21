import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      hd: ["stackle.app", "stacklehq.com"],
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});
