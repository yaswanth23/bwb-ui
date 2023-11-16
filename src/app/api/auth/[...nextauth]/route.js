import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "@/utils/api/auth";

const authOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        userIdentifier: {},
        password: {},
      },
      async authorize(credentials, req) {
        const user = await loginUser(
          credentials.userIdentifier,
          credentials.password
        );
        if (user?.data?.statusCode === 200) {
          return user;
        }
        return null;
      },
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
