import type { User } from "next-auth";
import React from "react";
import Navbar from "../Navbar/Navbar";

type Props = {
  children?: React.ReactNode;
  user?: User;
};

export default function Appshell({ user, children }: Props) {
  return (
    <>
      {" "}
      <div
        data-theme="emerald"
        className="flex min-h-screen flex-col items-center justify-center"
      >
        <Navbar user={user} />
        <main className="bg- flex w-full flex-1 flex-col items-center justify-center text-center">
          {children}
        </main>
      </div>
      {/*       <SigninModal />
      <SignupModal /> */}
    </>
  );
}
