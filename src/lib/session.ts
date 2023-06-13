import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/authOptions";
import { type Session, type User } from "@/types/user.type";

import { adminEmails, maintenanceAdminEmails } from "@/lib/constants/admins";

export async function getCurrentUser() {
  const session = (await getServerSession(authOptions)) as Session;

  if (session) {
    const user: User = session.user;
    if (adminEmails.includes(user.email)) {
      user.role = "admin";
    }
    if (maintenanceAdminEmails.includes(user.email)) {
      user.role = "maintenance-admin";
    }
    if (user.role === undefined) {
      user.role = "user";
    }

    return user;
  }

  return null;
}
