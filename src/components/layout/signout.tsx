"use client";

import { signOut } from "next-auth/react";

const SignOutButton = ({ email }: { email?: string }) => {
  return (
    <button onClick={() => signOut()} className="hover:text-red-600 underline">
      {email ? `Sign Out [${email.split("@")[0]}]` : "Sign Out"}
    </button>
  );
};

export default SignOutButton;
