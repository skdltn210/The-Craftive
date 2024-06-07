"use client";

import { signIn } from "next-auth/react";

export default function LoginBtn() {
  return (
    <button
      onClick={() => {
        signIn();
      }}
      className="mr-6"
    >
      LOGIN
    </button>
  );
}
