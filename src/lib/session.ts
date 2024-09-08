"use server";

import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/authOptions";
import { type Session, type User } from "@/types/user.type";

import { adminEmails, maintenanceAdminEmails } from "@/lib/constants/admins";

export async function getCurrentUser() {
  const session = (await getServerSession(authOptions)) as Session;
  // console.log("Session:", session); // Check if session is retrieved

  if (session) {
    const user: User = session.user;
    // console.log("User:", user); // Check if user is being set correctly

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
