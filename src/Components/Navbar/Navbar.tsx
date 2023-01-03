import type { User } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { default as NextLink } from "next/link";
import React from "react";

type Props = {
  user?: User;
};

export default function Navbar({ user }: Props) {
  return (
    <div className="navbar justify-between bg-primary px-4 text-slate-50">
      {user?.email ? (
        <NextLink href={`user/${user.id}`}>
          <p className=" mr-6 text-xl normal-case">My Profile</p>
        </NextLink>
      ) : (
        <p className=" mr-6 text-xl normal-case">Pythia </p>
      )}

      <div className="flex-grow">
        <NextLink href={"/stocklist"}>
          <p className=" text-xl normal-case">Stock List</p>
        </NextLink>
        <NextLink href={"/transaction"}>
          <p className=" text-xl normal-case">Transaction</p>
        </NextLink>
      </div>
      <div className="flex-grow-[8]"></div>
      <div className=" flex max-w-[200px] flex-grow justify-between">
        {user?.name ? (
          <>
            <button
              className=""
              onClick={async () => {
                signOut();
                /* const res = await fetch(LOGOUT_ROUTE, {
                  ...FETCH_BODY,
                }); */
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button
              className="btn-primary btn bg-gray-50"
              onClick={() => {
                signIn();
              }}
            >
              Sign In
            </button>

            {/* <label htmlFor={SIGNIN_MODAL_NAME} className="modal-button btn">
              Sign In
            </label>
            <label htmlFor={SIGNUP_MODAL_NAME} className="modal-button btn">
              Sign Up
            </label> */}
          </>
        )}
      </div>
    </div>
  );
}
