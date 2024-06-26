"use client";

import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import type { ClientSafeProvider } from "next-auth/react";

export default function LogoutButton({ auth }: { auth?: ClientSafeProvider }) {


  const handleLogout = async () => {
    try {
      await signOut();
      // redirect("/");
    } catch (error) {
      console.error("Error during signout:", error);
    }
  };

  return (
    <button
      type="button"
      className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
