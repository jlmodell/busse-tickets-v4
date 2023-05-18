import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/authOptions";
import { Session, User } from "@/types/user.type";

const adminEmails = ["jmodell@busseinc.com", "jflores@busseinc.com"];

export async function getCurrentUser() {
  const session = (await getServerSession(authOptions)) as Session;

  if (session) {
    const user: User = session.user;
    if (adminEmails.includes(user.email)) {
      user.role = "admin";
    }
    if (user.role === undefined) {
      user.role = "user";
    }

    return user;
  }

  return null;
}
