import { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

import clientPromise from "@/lib/sessionsdb";

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.NODEMAILER_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASSWORD,
        },
      },
      from: "it@busseinc.com",
      maxAge: 24 * 60 * 60, // 24 hours

      normalizeIdentifier(identifier: string): string {
        // You can also throw an error, which will redirect the user
        // to the error page with error=EmailSignin in the URL
        if (identifier.split("@").length > 2) {
          throw new Error("Only one email allowed");
        }

        // Get the first two elements only,
        // separated by `@` from user input.
        let [local, domain] = identifier.toLowerCase().trim().split("@");
        // The part before "@" can contain a ","
        // but we remove it on the domain part
        domain = domain.split(",")[0];

        // Whitespace is not allowed
        local = local.replace(/\s+/g, "");

        // email must be @busseinc.com
        if (domain !== "busseinc.com") {
          throw new Error("Invalid email domain, must be @busseinc.com");
        }

        return `${local}@${domain}`;
      },
    }),
  ],

  secret: process.env.SECRET,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 7 * 24 * 60 * 60, // 7 days
  },

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax", // or 'strict' if needed
        path: "/", // ensures cookie is available across all routes
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  adapter: MongoDBAdapter(clientPromise),
};
