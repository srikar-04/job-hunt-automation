import type { ExpressAuthConfig } from "@auth/express";
import GitHub from "@auth/express/providers/github";
import Google from "@auth/express/providers/google";
import { env } from "./env.schema.js";

export const authConfig: ExpressAuthConfig = {
  providers: [
    GitHub({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
  ],
  secret: env.AUTH_SECRET,
  trustHost: true,
  basePath: "/auth",
  callbacks: {
    async signIn({ user, account, credentials, profile, email }) {
      console.log(
        `userid: ${user.id} \n username: ${user.name} \n email: ${user.email} \n provider: ${account?.provider}, \n providerId: ${account?.providerAccountId}`
      );
      return true;
    },

    async redirect({ url, baseUrl }) {
      const frontendURL = env.FRONTEND_URL || baseUrl;
      const normalizedFrontendURL = frontendURL.replace(/\/$/, "");

      // allowing callback urls to pass throught auth.js
      if (url.includes("/auth/callback")) {
        return url;
      }

      if (url.startsWith("/")) {
        return `${normalizedFrontendURL}${url}`;
      }

      // Allow absolute URLs on frontend/backend origins
      try {
        const parsedUrl = new URL(url);
        const frontendOrigin = new URL(frontendURL).origin;
        const backendOrigin = new URL(baseUrl).origin;

        if (
          parsedUrl.origin === frontendOrigin ||
          parsedUrl.origin === backendOrigin
        ) {
          return url;
        }
      } catch {
        // Fall through to default redirect below
      }

      // Default safe redirect target
      return frontendURL;
    },

    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider && account.providerAccountId) {
          token.provider = account?.provider;
          token.providerUserId = account?.providerAccountId;
        } else {
          console.error("provider details not found");
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && token.provider && token.providerUserId) {
        session.provider = token.provider as string;
        session.providerUserId = token.providerUserId as string;
      }
      // console.log("session from backend : ", session)
      return session;
    },
  },
};
