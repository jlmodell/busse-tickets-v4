import { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

import clientPromise from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASSWORD,
        },
      },
      from: process.env.NODEMAILER_USER,
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

  adapter: MongoDBAdapter(clientPromise),
};
