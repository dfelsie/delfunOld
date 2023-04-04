import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import Appshell from "../Components/Appshell/Appshell";
import Welcome from "../Components/Welcome/Welcome";
import UserList from "../Components/UserList/UserList";

export default function Users() {
  const { data: sessionData, status } = useSession();
  const { data: userList, isLoading: userListIsLoading } =
    trpc.otheruserdata.getAllUsers.useQuery();
  //const userList=trpc.
  if (status === "loading" || userListIsLoading) {
    return <></>;
  }
  return (
    <>
      <Appshell user={sessionData?.user}>
        <UserList userList={userList ?? []} />
      </Appshell>
    </>
  );
}
