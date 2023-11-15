import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

const login = async (credentials) => {
  try {
    let userData;
    const loginApiUrl =
      "https://qar5m2k5ra.execute-api.ap-south-1.amazonaws.com/dev/v2/auth/login";

    const reqData = {
      userIdentifier: credentials.userIdentifier,
      password: credentials.password,
    };

    await fetch(loginApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.data?.statusCode === 200) {
          userData = data.data.userDetails;
        }

        if (data?.statusCode === 401) {
          throw new Error(data?.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return userData;
  } catch (e) {
    throw new Error("Failed to Login!");
  }
};

export const { signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const user = await login(credentials);
          return user;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
});
