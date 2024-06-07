"use client";

import { signOut } from "next-auth/react";

export default function LogoutBtn() {
  return (
    <button
      onClick={() => {
        signOut({ redirect: "true", callbackUrl: "/" });
      }}
      className="mr-6"
    >
      LOGOUT
    </button>
  );
}
